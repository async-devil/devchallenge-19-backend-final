/* eslint-disable no-bitwise */
import { PNG } from "pngjs";

import { Mine } from "./dto/image-input.dto";

export class ImageInputService {
	private readonly pngJs = new PNG({
		inputHasAlpha: false,
	});

	public pngData: PNG;

	constructor(private readonly png: string, private readonly minLevel: number) {}

	public async pngJsParseAsync(buffer: Buffer): Promise<PNG> {
		return new Promise((resolve, reject) => {
			this.pngJs.parse(buffer, (error, data) => {
				if (error) reject(error);
				resolve(data);
			});
		});
	}

	public transform255To100(value: number) {
		const coefficient = 255 / 100;

		return value / coefficient;
	}

	public async setPngData() {
		const base64PNGWithoutURIAttributes = this.png.replace("data:image/png;base64,", "");

		try {
			this.pngData = await this.pngJsParseAsync(
				Buffer.from(base64PNGWithoutURIAttributes, "base64url")
			);
		} catch (err) {
			throw {
				statusCode: 422,
				error: "Unprocessable Entity",
				details: "Invalid PNG",
			};
		}
	}

	public getPngPixelsInHorizontalLine(
		line: number,
		maxXExclusively = this.pngData.width,
		offset = 0
	) {
		if (line > this.pngData.height) throw new Error(`Invalid line, max: ${this.pngData.height}`);

		const buffer: number[] = [];

		for (let x = offset; x < maxXExclusively; x += 1) {
			const idx = (this.pngData.width * line + x) << 2;

			buffer.push(this.pngData.data[idx]);
		}

		return buffer;
	}

	public checkIfAllPixelsInLineAreWhite(line: number[]) {
		return line.filter((pixel) => pixel !== 255).length === 0;
	}

	/**
	 *    0   1       y
	 * ||--||--||     0
	 * ||  ||  || 0   1
	 * ||--||--||     2
	 * ||  ||  || 1   3
	 * ||--||--||     4
	 *
	 * Each cell has n pixels as width and height
	 * If width pixels in width are white, than y * 2 must be white line
	 * If not continue
	 * If last line from the last border, only one cell exist
	 *
	 * @returns Amount of width and height pixels inside the cell, due to squareness
	 */
	public getGridCellWidth() {
		for (let y = 1; y < this.pngData.height; y += 1) {
			// Gets first 5 and last 5 pixels in the line to optimize performance
			const horizontalPixels = [
				...this.getPngPixelsInHorizontalLine(y, 6),
				...this.getPngPixelsInHorizontalLine(y, 6, this.pngData.width - 5),
			];

			if (this.checkIfAllPixelsInLineAreWhite(horizontalPixels)) {
				const nextHorizontalPixels = [
					...this.getPngPixelsInHorizontalLine(y + y, 6),
					...this.getPngPixelsInHorizontalLine(y + y, 6, this.pngData.width - 5),
				];

				if (this.checkIfAllPixelsInLineAreWhite(nextHorizontalPixels)) {
					return y - 1;
				}
			}

			// If where is only one cell
			if (y === this.pngData.height - 1) {
				return y - 1;
			}
		}
	}

	public getNumberOfXAndYCells(internalWidth: number) {
		const numberOfCellsFormula = (imagePixels: number, internalCellPixels: number) =>
			(imagePixels - 1) / (internalCellPixels + 1);

		const numberOfXCells = numberOfCellsFormula(this.pngData.width, internalWidth);
		const numberOfYCells = numberOfCellsFormula(this.pngData.height, internalWidth);

		return [Math.floor(numberOfXCells), Math.floor(numberOfYCells)];
	}

	public getCellPixels(xCell: number, yCell: number, internalWidth: number) {
		const startCellPointFormula = (cellN: number, cellPixels: number) =>
			1 + (cellPixels + 1) * cellN;

		const startXCellPoint = startCellPointFormula(xCell, internalWidth);
		const startYCellPoint = startCellPointFormula(yCell, internalWidth);

		const buffer: number[] = [];

		for (let y = startYCellPoint; y < internalWidth + startYCellPoint; y++) {
			for (let x = startXCellPoint; x < internalWidth + startXCellPoint; x++) {
				const idx = (this.pngData.width * y + x) << 2;

				buffer.push(this.pngData.data[idx]);
			}
		}

		return buffer;
	}

	/**
	 * The lower amount of black pixels, the lower average risk
	 */
	public getCellPixelsAverageRisk(cellPixels: number[]) {
		const cellTotalPixels = cellPixels.length;

		const totalSum = cellPixels.reduce(
			(previousValue, currentValue) => previousValue + this.transform255To100(currentValue),
			0
		);

		return 100 - Math.round(totalSum / cellTotalPixels);
	}

	public async parseImage() {
		await this.setPngData();

		const gridCellWidth = this.getGridCellWidth();
		const [xCells, yCells] = this.getNumberOfXAndYCells(gridCellWidth);

		const buffer: Mine[] = [];

		for (let y = 0; y < yCells; y++) {
			for (let x = 0; x < xCells; x++) {
				const level = this.getCellPixelsAverageRisk(this.getCellPixels(x, y, gridCellWidth));

				if (level >= this.minLevel) buffer.push({ x, y, level });
			}
		}

		return buffer;
	}
}
