# Refugee Movement Since 1959

In this project, we set out to investigate what caused the major movements of people seeking asylum since 1959 and what similarities and differences exist across geographies and events.

Team Members
> Oliver Regele (oregele)

> Ankita Singh (asingh)

> Durgesh Das (ddas)

## Research and Development Process

The way we divided the project is largely based on three areas: data collection, front end development, and content development. Data collection comprised the analysis and cleaning of the UNHCR Popstats database. Due to the number of missing data counts, this was mostly automated, but still required manual intervention when some of the numbers did not add up or some of the characters in country names could not be read by our scripts. Front end development comprised building the scrollmagic.io framework and integrating D3 components. Content development comprised the research and analysis of the major events we covered in this study - the Rwandan genocide, the Venezuelan political conflict, and the Syrian civil war. 

Pulling all of these elements together, we each took a portion of the data collection, front end development, and content creation. Ankita built the scrollmagic slide elements that deep dive into the conflicts. She also gathered the conflict specific data that she used while developing the Sankey plots. Durgesh pulled the UNHCR data down, developed the overall layout for the visualization, converted the D3 visuals from before into a scrollmagic friendly version, and built the event specific visuals. Oliver was responsible for cleaning the datasets, gathering all the content, and integrating with the frontend layout. 

## Prerequisites

1. Download [NodeJS](https://nodejs.org/en/download/)

## Steps to Setup

1. Navigate to the folder where you have cloned the repo

2. Run the following command to install the server package

```bash

npm install

```

3. Run the following command to spin up the local server

```bash

node server.js

```

4. Navigate to [localhost](http://localhost:8000/index.html)

## License

[MIT](https://choosealicense.com/licenses/mit/)