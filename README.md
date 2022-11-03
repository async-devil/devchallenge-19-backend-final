# DEV Challenge XIX backend final nomination solution

_28.10.22 11:30 - 28.10.22 18:30_

## Run docker image:

```bash
$ sudo docker compose build
$ sudo docker compose up
```

## Local installation:

```bash
$ yarn instal
```

## Local start:

```bash
$ yarn build
$ yarn start
```

## Test:

```bash
$ yarn test
$ yarn test:cov
```

## Access at:

`http://localhost:8080/api/<method>` or `http://127.0.0.1:8080/api/<method>`

## Api routes:

- POST `/image-input`

## Description

This task was about image processing and calculating grid cells borders. First of all I started to search grid borders. It requested from me searching the recurring lines of white pixels. That was the border. Than I iterated internal cell pixels, and calculated their percent of darkness value and average. After that yet another iteration and formatted data into requested format.

I might say that I optimized code to have less latency, but for the production purposes, I would add more complicated grid validation.

## Results

| **Criteria**              | **Points** | **Max points** |
| ------------------------- | :--------: | :------------: |
| **Technical assessment**  |  **297**   |    **350**     |
| Result correctness        |    156     |      190       |
| Following API format      |     50     |       60       |
| Image processing solution |     91     |      100       |
| **Expert assessment**     |  **223**   |    **290**     |
| Performance               |    166     |      190       |
| Test coverage             |     57     |      100       |
| **_Total_**               | **_520_**  |   **_640_**    |

I took the **6th** place in the backend nomination.

## Task you can find at:

`task.pdf`

All task test images are stored in: `/img`
