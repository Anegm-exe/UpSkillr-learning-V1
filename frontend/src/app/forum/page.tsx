import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../api/axios";
import "../../../styles/globals.css";
import { useAuth } from "@/components/AuthContext";
import { text } from "stream/consumers";
import {messageCard} from "/messageCard.tsx";


export default function forumPage(params : {forumId: string}) {

  return (
      <div>
          <h1>Forums</h1>
          <ul>
              {forums.map((forum) => (
                  <li key={forum.id}>
                      <a href={`/forums/${forum.id}`}>{forum.title}</a>
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default ForumList;

export default forumPage;
