interface TokenPayload {
  sub: { userId: string; hashedPassword: string };
}

export default TokenPayload;
