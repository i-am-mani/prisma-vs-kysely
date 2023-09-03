"use client";
import * as React from "react";
import JsonView from "react18-json-view";
import { createManyUsers, createUser, readAllUsers } from "../actions/users";

type Response = {
  createOneUser: any;
  createManyUser: any;
  readAllUsers: any;
};

export function UserTableSection() {
  const [responses, setResponses] = React.useState<Response>({
    createOneUser: null,
    createManyUser: null,
    readAllUsers: null,
  });

  const onClick = (fn: () => Promise<any>, key: keyof Response) => async () => {
    const result = await fn();
    setResponses({ ...responses, [key]: result });
  };

  return (
    <div>
      <h2 className="text-2xl">Users</h2>
      {[
        {
          callback: onClick(createUser, "createOneUser"),
          name: "Create Single User",
          result: responses.createOneUser,
        },
        {
          callback: onClick(() => createManyUsers(100), "createManyUser"),
          name: "Create 100 Users",
          result: responses.createManyUser,
        },
        {
          callback: onClick(readAllUsers, "readAllUsers"),
          name: "Read all users",
          result: responses.readAllUsers,
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
