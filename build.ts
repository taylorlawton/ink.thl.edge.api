try {
  const buildResult = await Bun.build({
    entrypoints: ['src/main.ts'],
    outdir: 'dist',
    root: 'src',
    target: 'node',
    minify: true,
    metafile: true,
    external: ['@bunny.net/edgescript-sdk', '@libsql/client/web', 'node:process'],
    define: {
      'process.env.NODE_ENV': "'production'",
    },
    banner: `
//
//  THIS SCRIPT IS HOMEMADE.
//
`,
    footer: `
//  https://thl.ink/
  `,
  });

  if (buildResult.success) {
    const buildOutput = buildResult.metafile?.outputs;
    let outputString = 'Build success! ✨';

    if (buildOutput && Object.keys(buildOutput).length > 0) {
      for (const [outputPath, outputInfo] of Object.entries(buildOutput)) {
        const outputSizeKB = (outputInfo.bytes / 1024).toFixed(2);
        outputString += `\n📄 ${outputPath}: ${outputSizeKB} KB`;
      }
    }
    
    Bun.stdout.write(`${outputString}\n`);
  }
} catch (error) {
  Bun.stderr.write('Build failed: ' + error + '\n');
}
