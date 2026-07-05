export type BackendStatus = "healthy" | "unreachable";

export function interpretHealthResponse(
  ok: boolean,
  body: unknown,
): BackendStatus {
  const isOkBody =
    typeof body === "object" &&
    body !== null &&
    "status" in body &&
    body.status === "ok";
  return ok && isOkBody ? "healthy" : "unreachable";
}
