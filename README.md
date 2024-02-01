# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

# SvelteKit Project Setup

This project is configured to use SvelteKit with two different adapters: an auto adapter for local development and the Cloudflare Pages adapter for deployment. Follow the instructions below to run the project in a development environment or prepare it for deployment on Cloudflare Pages.

## Prerequisites

- Node.js installed on your machine
- A Cloudflare Pages account for deployment

## Installation

First, clone the repository and install the dependencies:

    git clone <your-repository-url>
    cd <your-project-directory>
    npm install

## Running Locally

To run the project locally using the auto adapter, simply start the development server:

    npm run dev

This will serve your application on http://localhost:3000 by default. The auto adapter is selected automatically for local development.

### Running Locally on VSCode with Debugger

Create a launch.json in the .vscode folder and paste the following configuration:

    {
        // server - runs dev server in dev mode, allowing for breakpoints on server side code.
        // chrome - uses Chrome and allows for breakpoints for client side code.
        // Both (Client & Server) - debugging for both the server side and the client side.
        
        "version": "0.2.0",
        "configurations": [
            {
                "name": "server",
                "request": "launch",
                "runtimeArgs": ["run-script", "dev"],
                "runtimeExecutable": "npm",
                "skipFiles": ["<node_internals>/**"],
                "type": "node",
                "console": "integratedTerminal"
            },
            {
                "type": "chrome",
                "request": "launch",
                "name": "chrome",
                "url": "http://localhost:5173",
                "webRoot": "${workspaceFolder}"
            }
        ],
        "compounds": [
            {
                "name": "Both (Client & Server)",
                "configurations": ["server", "chrome"]
            }
        ]
    }

## Deploying to Cloudflare Pages

To prepare your application for deployment on Cloudflare Pages, you need to set an environment variable to switch to the Cloudflare Pages adapter. This can be done in two ways:

### 1. Environment Variable in Cloudflare Pages Settings

When configuring your project on Cloudflare Pages, set the following environment variable:

- Name: ADAPTER
- Value: cloudflare

This tells your application to use the Cloudflare Pages adapter for the build process on Cloudflare.

### 2. Local Testing with Cloudflare Pages Adapter

If you wish to test the Cloudflare Pages adapter locally, you can temporarily set the environment variable in your terminal:

    export ADAPTER=cloudflare

Then, run your build process:

    npm run build

**Note:** The built site may not function exactly as expected locally because it's optimized for Cloudflare Pages.

## Deployment

After setting the environment variable in your Cloudflare Pages project settings, push your changes to the connected Git repository. Cloudflare Pages will automatically build and deploy your site using the settings configured.

## Additional Notes

- Ensure all necessary environment variables and project settings are configured in Cloudflare Pages for your application to work correctly.

- For detailed documentation on SvelteKit and the adapters, refer to the [SvelteKit documentation](https://kit.svelte.dev/docs).

