interface TokenPayload {
  sub: { companyId: number; hashedPassword: string };
}

export default TokenPayload;
