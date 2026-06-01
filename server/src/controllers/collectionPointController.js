import CollectionPoint from "../models/CollectionPoint.js";

const toRadians = (value) => (value * Math.PI) / 180;

const distanceKm = (from, to) => {
  if (!Number.isFinite(from?.lat) || !Number.isFinite(from?.lng)) return null;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const listActiveCollectionPoints = async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng);
  const wasteType = req.query.wasteType;

  const query = { status: "active" };
  if (wasteType) query.acceptedWasteTypes = wasteType;

  const points = await CollectionPoint.find(query)
    .populate("assignedCollectors", "name email phone role")
    .sort({ name: 1 });

  const data = points
    .map((point) => {
      const object = point.toObject();
      const distance = hasLocation
        ? distanceKm({ lat, lng }, { lat: point.coordinates.lat, lng: point.coordinates.lng })
        : null;

      return {
        ...object,
        distanceKm: distance === null ? null : Number(distance.toFixed(2)),
      };
    })
    .sort((a, b) => {
      if (a.distanceKm === null || b.distanceKm === null) return 0;
      return a.distanceKm - b.distanceKm;
    });

  res.json({ success: true, data });
};
