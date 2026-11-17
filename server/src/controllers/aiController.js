export const getDIYRecommendations = async (req, res) => {
  const serviceUrl = process.env.AI_SERVICE_URL;

  if (!serviceUrl) {
    return res.status(503).json({
      success: false,
      message: "The JijiGreen AI service is not configured.",
    });
  }

  const material = String(req.query.material ?? "").trim();
  const audience = String(req.query.audience ?? "user").trim() || "user";

  if (!material) {
    return res.status(400).json({
      success: false,
      message: "Material is required for DIY guidance.",
    });
  }

  try {
    const url = new URL(`${serviceUrl.replace(/\/+$/, "")}/recommendations/diy`);
    url.searchParams.set("material", material);
    url.searchParams.set("audience", audience);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(60000),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        success: false,
        message: result?.detail || result?.message || "DIY recommendations are unavailable.",
      });
    }

    return res.json({
      success: true,
      ...result,
      notice: result?.notice || "These recommendations are advisory and should be reviewed before use.",
    });
  } catch (error) {
    console.error("[ai-diy-recommendations]", error);

    return res.status(
      error.name === "TimeoutError" || error.name === "AbortError" ? 504 : 502
    ).json({
      success: false,
      message:
        error.name === "TimeoutError" || error.name === "AbortError"
          ? "AI recommendations timed out. Please try again."
          : "Unable to reach the JijiGreen AI service.",
    });
  }
};

export const getCollectionPointRecommendations = async (req, res) => {
  const serviceUrl = process.env.AI_SERVICE_URL;

  if (!serviceUrl) {
    return res.status(503).json({
      success: false,
      message: "The JijiGreen AI service is not configured.",
    });
  }

  const material = String(req.query.material ?? "").trim();
  const condition = String(req.query.condition ?? "").trim();
  const quantityKg = Number(req.query.quantity_kg ?? req.query.quantityKg ?? 0);
  const latitude = Number(req.query.latitude ?? 0);
  const longitude = Number(req.query.longitude ?? 0);

  if (!material || !condition || !Number.isFinite(quantityKg) || quantityKg <= 0) {
    return res.status(400).json({
      success: false,
      message: "Material, condition, and a positive quantity are required.",
    });
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({
      success: false,
      message: "Valid latitude and longitude are required.",
    });
  }

  try {
    const url = new URL(`${serviceUrl.replace(/\/+$/, "")}/recommendations/collection-points`);
    url.searchParams.set("material", material);
    url.searchParams.set("condition", condition);
    url.searchParams.set("quantity_kg", String(quantityKg));
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(60000),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        success: false,
        message: result?.detail || result?.message || "Collection-point recommendations are unavailable.",
      });
    }

    return res.json({
      success: true,
      ...result,
      notice: result?.notice || "Recommendations are prioritised from JijiGreen collection points to confirmed partners before external facilities.",
    });
  } catch (error) {
    console.error("[ai-collection-recommendations]", error);

    return res.status(
      error.name === "TimeoutError" || error.name === "AbortError" ? 504 : 502
    ).json({
      success: false,
      message:
        error.name === "TimeoutError" || error.name === "AbortError"
          ? "Collection recommendations timed out. Please try again."
          : "Unable to reach the JijiGreen AI service.",
    });
  }
};

export const analyzeWasteImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "A waste image is required.",
    });
  }

  const serviceUrl = process.env.AI_SERVICE_URL;

  if (!serviceUrl) {
    return res.status(503).json({
      success: false,
      message: "The JijiGreen AI service is not configured.",
    });
  }

  try {
    const form = new FormData();

    form.append(
      "file",
      new Blob([req.file.buffer], { type: req.file.mimetype }),
      req.file.originalname || "waste-image.jpg"
    );

    form.append(
      "is_bottle",
      String(req.body.isBottle === "true")
    );

    const response = await fetch(
      `${serviceUrl.replace(/\/+$/, "")}/predict`,
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(60000),
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        success: false,
        message: result?.detail || result?.message || "AI analysis failed.",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("[ai-image-analysis]", error);

    return res.status(
      error.name === "TimeoutError" || error.name === "AbortError" ? 504 : 502
    ).json({
      success: false,
      message:
        error.name === "TimeoutError" || error.name === "AbortError"
          ? "AI analysis timed out. Please try again."
          : "Unable to reach the JijiGreen AI service.",
    });
  }
};
