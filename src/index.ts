import ts from "byots";
import { Context } from "./Context";
import { Stage1 } from "./stages/Stage1";
import { Stage2 } from "./stages/Stage2";

export interface TransformerConfig {
	_: void;
}

export default function (program: ts.Program, config: TransformerConfig) {
	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const transformContext = new Context(program, config, context, [Stage1, Stage2]);
		let transformed: Map<ts.SourceFile, ts.SourceFile>;
		return (file: ts.SourceFile) => {
			if (!transformed) {
				transformed = transformContext.transformAll(program.getSourceFiles());
			}
			return transformed.get(file) ?? file;
		};
	};
}
