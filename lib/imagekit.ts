export const authenticator = async () => {
  const response = await fetch("/api/imagekit/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};
