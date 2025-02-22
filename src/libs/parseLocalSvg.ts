import glob from "glob";
import path from "path";
import { Config } from "../libs/getConfig";
import * as fs from "fs";

export interface ILocalSvg {
  svgStr: string;
  name: string;
  styleType: boolean;
}

const parseLocalSvg = ({ icon_svg }: Config) => {
  if (!icon_svg) {
    return [];
  }

  const localDir = path.resolve(icon_svg);

  const localSvg = glob.sync(path.join(localDir, "**/*.svg"));

  return localSvg.reduce<ILocalSvg[]>((previousValue, currentValue) => {
    let svgStr = fs.readFileSync(currentValue, "utf-8");

    /**
     * 去除注释,title,desc等不需要的标签
     */
    svgStr = svgStr
      .substring(svgStr.indexOf("<svg "), svgStr.indexOf("</svg>") + 6)
      .replace(/<!-(.*?)->/g, "")
      .replace(/<title>(.*?)<\/title>/g, "")
      .replace(/<desc>(.*?)<\/desc>/g, "")
      .replace(/fill\=\"none\"/g, "");

    const styleType =
      !!~svgStr.indexOf("</style>") || !!~svgStr.indexOf("style=");

    previousValue.push({
      svgStr,
      name: path.basename(currentValue, ".svg"),
      styleType,
    });

    return previousValue;
  }, []);
};

export default parseLocalSvg;
