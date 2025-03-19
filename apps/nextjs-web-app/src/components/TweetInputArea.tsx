"use client";

import React, { startTransition, useActionState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import Image from "next/image";
import DP from "@/../public/dashboard/dp.png";
import Post from "@/../public/Icons/dashboard/send.png";
import { createTweetAction } from "@/actions/tweet.actions";
import { spawnaToast } from "@/lib/utils";

const initialConfig = {
  namespace: "TweetEditor",
  theme: {},
  onError: (error: Error) => console.error(error),
  nodes: []
};

function PostTweetButton() {
  const [editor] = useLexicalComposerContext();
  const [actionState, action, isPending] = useActionState(createTweetAction, null);

  const saveTweet = async () => {
    editor.update(async () => {
      try {
        const rawContent = $getRoot().getTextContent();
        console.log("Saved Tweet:", rawContent); // TODO: test whether it is saving or not
        startTransition(async () => {
          await action({ text: rawContent });
        });
        spawnaToast("new tweet created", "default");
      } catch (error) {
        spawnaToast("Error while Posting tweet", "destructive");
      }
    });
  };

  return (
    <button
      className="xs:right-6 xs:bottom-6 absolute bottom-3 right-3 rounded-[8px] bg-gradient-to-r from-[#4135F3] to-[#BE52F2] p-[1px]"
      onClick={saveTweet}
    >
      <div className="bg-brand-dark flex gap-x-2 rounded-[8px] px-4 py-2">
        <Image alt="post" src={Post} />
        <p>Post</p>
      </div>
    </button>
  );
}

export default function TweetInput() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="xs:p-8 xs:min-h-52 border-neutral-11 relative flex min-h-44 flex-col border-b-[1px] p-4">
        <div className="flex h-full w-full items-start gap-x-2">
          <Image src={DP} alt="DP" className="h-[50px] w-[50px]" />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="placeholder:text-neutral-7 bg-brand-dark flex-grow resize-none overflow-hidden border-transparent text-blue-50 outline-none focus:border-transparent focus:ring-0" />
            }
            ErrorBoundary={() => <div>Error loading editor</div>}
          />
        </div>
        <PostTweetButton />
      </div>
    </LexicalComposer>
  );
}
