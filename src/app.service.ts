import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { useSupabaseRowLevelSecurity } from './prismaExtensions/useSupabaseRowLevelSecurity';

@Injectable()
export class AppService {
  // Prisma Client with RLS Policies Enforced
  private readonly rlsPrismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.RLS_DATABASE_URL,
      },
    },
  });
  // Prisma Client that Bypasses Any Security Policies (SHOULD BE LIMITED)
  private readonly bypassRlsPrismaClient = new PrismaClient();

  /**
   * @returns string
   */
  async getHello(): Promise<string> {
    console.log('Getting first user profiles');
    const userId1 = 'a6307b51-696c-4274-9705-96cac2febb8d';

    const result = await this.rlsPrismaClient
      .$extends(
        useSupabaseRowLevelSecurity({
          claimsFn: () => ({
            sub: userId1,
          }),
        }),
      )
      .user_profiles.findMany({
        where: {
          user_id: userId1,
        },
      });
    const noClaimsResult = await this.rlsPrismaClient.user_profiles.findMany({
      where: {
        user_id: userId1,
      },
    });
    const bypassResult =
      await this.bypassRlsPrismaClient.user_profiles.findMany();

    const myResponse = {
      rlsUserResult: result,
      bypassResult: bypassResult,
      rlsUserWithNoClaims: noClaimsResult,
    };
    console.log('Here are my results:', myResponse);
    return JSON.stringify(myResponse, null, '\t');
  }
}
