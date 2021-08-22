### Get started with managed version

- Visit [flags.stackonfire.dev](https://flags.stackonfire.dev) and sign in with any convenient method.
- Create a new project
- Create a new flag, rename it and add description if needed
- Copy the link from the project page and make a request to that url to retrieve your feature flags

Here is a simple implementation of how you might user the feature.

## React example

Implement the context that fetches the flags from url by project id that we pass

```javascript
import * as React from "react";
import { useState, useEffect } from "react";

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
  const context = React.useContext(FlagsContext);
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
