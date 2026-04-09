import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// OAuth callbacks must stay public: redirect host (e.g. Vercel) often has no Clerk cookie
// when the user started Connect from localhost — session lives on another origin.
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/payment(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Skip OAuth callbacks entirely — Clerk must not touch Facebook's redirect (preserves ?code=&state=)
        '/((?!_next|callback|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};