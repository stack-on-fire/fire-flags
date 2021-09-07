![fireflags-banner](https://user-images.githubusercontent.com/29632358/132315785-1daa0f46-92d9-45da-963d-d991dc705d5f.png)

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

### Use with React

[Official fire-flags library for react](https://github.com/stack-on-fire/react-fire-flags) - engineered by [Alfredo Salzillo](https://github.com/alfredosalzillo)

## Get started with self-hosted version

Fire flags is dead simple to self host! You need to have an instance of Postgres database running, as long as you have the connection string you can safely deploy to Vercel. Environments variables necessary to run the app are listed in `.example.env`

Fire-flags currently offers three methods of authentication - magic link, github and twitter. The auth setup is powered by Next-auth and to make it work you need to provide correct environment variables to the project.

> Contributions for dockerised version are highly welcome

## Contribute

- Clone the repo
- run `docker-compose up -d` in the terminal to boot up the database
- development environment uses MSW to mock session, so you don't need to set up next-auth related env variables to be able to log in. If you need to mimic login workflow - disable service workers in `_app.tsx` 
- run `yarn run dev` 
