import { NextAuth } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

declare module "@/auth" {
    const auth: ReturnType<typeof NextAuth>
    export { auth }
}
