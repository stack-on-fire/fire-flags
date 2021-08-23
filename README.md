# Fire flags 🔥

Suggest new features here

</a><a href="https://github.com/stack-on-fire/fire-flags/discussions">
  <img alt="Join the discussion on Github" src="https://img.shields.io/badge/Github%20Discussions%20%26%20Support-Chat%20now!-blue" />
</a>

Dead simple and blazing fast feature-flags platform. Get started in minutes. Be confident when releasing new features for your application - you are one kill switch away from disabling the feature if it breaks. Just turn it off now and fix it later 👌

![App example](img/app-demo.png?raw=true "App example")

## Get started with managed version

- Visit [flags.stackonfire.dev](https://flags.stackonfire.dev) and sign in with any convenient method.
- Create a new project
- Create a new flag, rename it and add description if needed
- Copy the link from the project page and make a request to that url to retrieve your feature flags

Here is a simple implementation of how you might user the feature.

### React example

Implement the context that fetches the flags from url by project id that we pass

```javascript
import * as React from "react";
import { useState, useEffect, useContext } from "react";

const FlagsContext = React.createContext([]);

function FlagsProvider({ children, projectId }) {
  if (projectId === undefined) {
    throw new Error("FlagsProvider expects project id");
  }
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://flags.stackonfire.dev/api/flags/${projectId}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [projectId]);

  return <FlagsContext.Provider value={data}>{children}</FlagsContext.Provider>;
}

function useFlags() {
  const context = useContext(FlagsContext);
  if (context === undefined) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
}

export { FlagsProvider, useFlags };

```

Somewhere on the top level of the your app you need to provide the id of the project which is present in the link you've copied:

```javascript
 <FlagsProvider projectId="xxxxxxxxxxxxxxx">
     <App/>
  </FlagsProvider>

```

In your app component:

```javascript
import { useFlags } from "context/flags-context";

const Component = () => {
  const flags = useFlags();
  const foundFlag = flags.find((flag) => flag.name === "test-flag-1");

  return <div>{foundFlag.isActive ? <p>Hello there</p> : null}</div>;
};
```

## Get started with self-hosted version

Fire flags is dead simple to self host! You need to have an instance of Postgres database running, as long as you have the connection string you can safely deploy to Vercel. Environments variables necessary to run the app are listed in `.example.env`

Fire-flags currently offers three methods of authentication - magic link, github and twitter. The auth setup is powered by Next-auth and to make it work you need to provide correct environment variables to the project.

> Contributions for dockerised version are highly welcome

## Contribute

- Clone the repo
- run `docker-compose up -d` in the terminal to boot up the database
- development environment uses MSW to mock session, so you don't need to set up next-auth related env variables to be able to log in. If you need to mimic login workflow - disable service workers in `_app.tsx` 
- run `yarn run dev` 
