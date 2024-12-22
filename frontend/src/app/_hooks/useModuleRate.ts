import { useState } from "react";
import axios from "../api/axios";

export const useModuleRate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const rateModule = async (moduleId: string, rating: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.patch(`module/${moduleId}/rate/${rating}`);
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit rating. " + err);
    } finally {
      setLoading(false);
    }
  };

  return { rateModule, loading, error, success };
};
