import User from "../models/User.js";
import School from "../models/School.js";
import Reward from "../models/Reward.js";
import { getPlatformAnalytics } from "../services/analyticsEngine.js";

export const getAdminDashboard = async (_req, res) => {
  res.json(await getPlatformAnalytics());
};

export const listUsers = async (_req, res) => {
  res.json(await User.find().select("-password").sort({ createdAt: -1 }));
};

export const listSchools = async (_req, res) => {
  res.json(await School.find().sort({ name: 1 }));
};

export const createSchool = async (req, res) => {
  res.status(201).json(await School.create(req.body));
};

export const createReward = async (req, res) => {
  res.status(201).json(await Reward.create(req.body));
};
