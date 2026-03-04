import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { getNewTokensWithRefreshToken } from "./services/auth.services";


async function refreshTokenMiddleware(refreshToken:string):Promise<boolean> {
    try {
        const refresh=await getNewTokensWithRefreshToken(refreshToken);
        if(!refresh){
            return false
        }
        return true
    } catch (error) {
        console.log("Error refreshing token",error);
        return false
    }
}


export async function proxy(request: NextRequest) {
    try {
            const {pathname} = request.nextUrl;  //eg /dashboard, /admin/dashboard, /doctor/dashboard

    const accessToken=request.cookies.get("accessToken")?.value;
    const refreshToken=request.cookies.get("refreshToken")?.value;


    const decodedAccessToken=accessToken && jwtUtils.verifyToken(accessToken,process.env.JWT_ACCESS_SECRET as string).data;

    const isValidAccessToken=accessToken && jwtUtils.verifyToken(accessToken,process.env.JWT_ACCESS_SECRET as string).success;

    let userRole:UserRole | null=null;

    if(decodedAccessToken){
        userRole=decodedAccessToken.role as UserRole;
    }

    const routeOwner=getRouteOwner(pathname);

    const unifySuperAdminAndAdminRole=userRole==="SUPER_ADMIN"?"ADMIN":userRole;

    userRole=unifySuperAdminAndAdminRole;


    const isAuth=isAuthRoute(pathname);

    // Rule 1 : If user is authenticated and has a valid access token, redirect them to the default dashboard route of their role
    if(isAuth && isValidAccessToken){
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole),request.url));
    }

    // Rule 2:User trying to access public routes
    if(routeOwner===null){
        return NextResponse.next();
    }

    // Rule3: User is not logged in but trying to access a protected route
    if(!accessToken){
        const loginUrl=new URL("/login",request.url);
        loginUrl.searchParams.set("redirect",pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rule 4: User is logged in but trying to access a route that is not owned by them
    if(routeOwner==="COMMON"){
        return NextResponse.next();
    }

    // Rule 5: User trying to visit role based protected routes but doesn't have the required role
    if(routeOwner==="DOCTOR" || routeOwner==="PATIENT" || routeOwner==="ADMIN"){
        if(routeOwner!==userRole){
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole),request.url));
        }
    }

    return NextResponse.next();


    } catch (error) {
        console.log("Error in proxy middleware",error);
    }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
