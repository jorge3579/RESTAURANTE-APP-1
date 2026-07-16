import { randomUUID } from "crypto";

export default function requestIdMiddleware(
    req,
    res,
    next
) {

    req.requestId =
        req.headers["x-request-id"] ||
        randomUUID();

    res.setHeader(
        "X-Request-Id",
        req.requestId
    );

    next();

}