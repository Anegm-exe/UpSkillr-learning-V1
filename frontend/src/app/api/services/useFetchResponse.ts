/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "../../api/axios";

export function useFetchResponse(quiz_id: string) {
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    if (quiz_id) {
      const fetchProgressData = async () => {
        try {
          const response = await axios.get(`/response/quiz/${quiz_id}`);
          setResponseData(response.data);
        } catch {
          console.error("Error fetching response data");
        }
      };

      fetchProgressData();
    }
  }, [quiz_id]);

  return { responseData };
}