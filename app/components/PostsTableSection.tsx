"use client";
import * as React from "react";
import JsonView from "react18-json-view";
import { ComplexJoin, readPostsWithUID } from "../actions/posts";

type Response = {
  readPostsByUID: any;
  simpleJoin: any;
};

export function PostsTableSection() {
  const [responses, setResponses] = React.useState<Response>({
    readPostsByUID: null,
    simpleJoin: null,
  });

  const onClick = (fn: () => Promise<any>, key: keyof Response) => async () => {
    const result = await fn();
    setResponses({ ...responses, [key]: result });
  };

  return (
    <div>
      <h2 className="text-2xl mt-5">Posts</h2>
      {[
        {
          name: "Read Posts with UID",
          callback: onClick(readPostsWithUID, "readPostsByUID"),
          result: responses.readPostsByUID,
        },
        {
          name: "Simple Inner Join (Finds all users that follow user A)",
          callback: onClick(ComplexJoin, "simpleJoin"),
          result: responses.simpleJoin,
        },
      ].map(({ callback, name, result }) => {
        return (
          <form action={callback} className="border-b pb-4" key={name}>
            <div className="flex flex-col gap-y-4 mt-4" key={name}>
              <div>
                <button className="px-4 py-2.5 bg-blue-600 text-white border-2 border-blue-600 rounded-md shadow-md">
                  {name}
                </button>
              </div>
              {result ? (
                <JsonView src={result} />
              ) : (
                <div className="text-gray-400 mt-2 font-semibold">
                  Click the button to see the benchmark
                </div>
              )}
            </div>
          </form>
        );
      })}
    </div>
  );
}
