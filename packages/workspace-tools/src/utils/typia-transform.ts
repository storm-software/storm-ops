import type ts from "typescript";
import transform from "typia/lib/transform";

export const getTypiaTransform = (
  program: ts.Program,
  diagnostics: ts.Diagnostic[],
) =>
  transform(program, {}, { addDiagnostic: (input) => diagnostics.push(input) });
