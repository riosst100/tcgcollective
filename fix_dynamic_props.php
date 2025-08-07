<?php
$directory = 'vendor/riosst100/';
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

foreach ($files as $file) {
    if ($file->getExtension() !== 'php') continue;

    $content = file_get_contents($file);
    
    // Cari nama class & lokasi pembuka `{`
    if (preg_match('/(class\s+\w+(?:\s+extends\s+\w+)?(?:\s+implements\s+[^{]+)?\s*){/', $content, $classMatch, PREG_OFFSET_CAPTURE)) {
        $usedProps = [];
        preg_match_all('/\$this->([a-zA-Z0-9_]+)/', $content, $matches);
        $usedProps = array_unique($matches[1]);

        preg_match_all('/(public|protected|private)\s+\$([a-zA-Z0-9_]+)/', $content, $declaredMatches);
        $declaredProps = array_unique($declaredMatches[2]);

        $diff = array_diff($usedProps, $declaredProps);
        if (empty($diff)) continue;

        $insertPos = $classMatch[0][1] + strlen($classMatch[0][0]);
        $declarations = "\n";
        foreach ($diff as $prop) {
            $declarations .= "    protected \$$prop;\n";
        }

        $newContent = substr($content, 0, $insertPos) . $declarations . substr($content, $insertPos);
        file_put_contents($file, $newContent);
        echo "✅ Fixed: {$file}\n";
    }
}
