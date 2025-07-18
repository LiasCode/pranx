export function filePathToRoutingPath(input: string, appendSlash = true): string {
  let output = input;
  const steps = input.split("/").filter((s) => s !== "/" && s !== "");

  if (steps.length === 0) {
    output = "/";
    return output;
  }

  const outputSplitted = [];
  for (const step of steps) {
    if (step.length >= 3) {
      // Manage (path) -> ignore segment
      if (step.startsWith("(") && step.endsWith(")")) {
        continue;
      }

      // Optional catch-all: [[...param]]
      const optionalCatchAll = /^\[\[\.\.\.(.+)\]\]$/.exec(step);
      if (optionalCatchAll) {
        const param = optionalCatchAll[1];
        outputSplitted.push(`(:${param}*)?`);
        continue;
      }

      // Catch-all: [...param]
      const catchAll = /^\[\.\.\.(.+)\]$/.exec(step);
      if (catchAll) {
        outputSplitted.push("*");
        continue;
      }

      // Dynamic: [param]
      const dynamic = /^\[(.+)\]$/.exec(step);
      if (dynamic) {
        outputSplitted.push(`:${dynamic[1]}`);
        continue;
      }
    }

    // Push default
    outputSplitted.push(step);
  }

  output = `/${outputSplitted.join("/")}${appendSlash ? "/" : ""}`;

  return output;
}
