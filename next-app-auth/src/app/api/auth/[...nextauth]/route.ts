
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import NextAuth from "next-auth/next";
import prisma from "../../../../lib/prisma";
import { User } from "@prisma/client";
import { authOptions } from "../../../../lib/auth";

const handler=NextAuth(authOptions)

export {handler as GET, handler as POST}
