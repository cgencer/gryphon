
"deps.js oluşturmak için sh da bunu çalıştır "

python frontend/tools/goog/build/depswriter.py --root_with_prefix='frontend/javascript/ ../../../../' --output_file='frontend/javascript/deps.js'


"compiled.js oluşturmak için"


python frontend/tools/goog/build/closurebuilder.py --root=frontend/javascript/ --namespace="loxodonta.Bootstrapper" --output_mode=compiled --output_file=frontend/javascript/compiled/compiled.js --compiler_jar=frontend/tools/goog/compiler/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--output_wrapper='(function(){%output%})()'" --compiler_flags="--create_source_map='frontend/javascript/compiled/source_map.js'" --compiler_flags="--property_map_output_file='frontend/javascript/compiled/properties.out'" --compiler_flags="--variable_map_output_file='frontend/javascript/compiled/variables.out'" --compiler_flags="--warning_level=VERBOSE"  --compiler_flags="--jscomp_error=accessControls" --compiler_flags="--jscomp_error=checkRegExp" --compiler_flags="--jscomp_error=checkTypes" --compiler_flags="--jscomp_error=checkVars" --compiler_flags="--jscomp_error=invalidCasts" --compiler_flags="--jscomp_error=missingProperties" --compiler_flags="--jscomp_error=nonStandardJsDocs" --compiler_flags="--jscomp_error=strictModuleDepCheck" --compiler_flags="--jscomp_error=undefinedVars" --compiler_flags="--jscomp_error=unknownDefines" --compiler_flags="--jscomp_error=visibility"



//--compiler_flags="--externs=frontend/javascript/externs/codemirror.externs.js"

python frontend/tools/goog/build/closurebuilder.py --root=frontend/javascript/ --namespace="loxodonta.Bootstrapper" --output_mode=compiled --output_file=frontend/javascript/compiled/compiled.js --compiler_jar=frontend/tools/goog/compiler/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--output_wrapper='(function(){%output%})()'" --compiler_flags="--create_source_map='frontend/javascript/compiled/source_map.js'" --compiler_flags="--property_map_output_file='frontend/javascript/compiled/properties.out'" --compiler_flags="--variable_map_output_file='frontend/javascript/compiled/variables.out'" --compiler_flags="--warning_level=VERBOSE" --compiler_flags="--externs=frontend/javascript/externs/codemirror.externs.js" --compiler_flags="--externs=frontend/javascript/externs/appengine.extern.js"  --compiler_flags="--jscomp_error=accessControls" --compiler_flags="--jscomp_error=checkRegExp" --compiler_flags="--jscomp_error=checkTypes" --compiler_flags="--jscomp_error=checkVars" --compiler_flags="--jscomp_error=invalidCasts" --compiler_flags="--jscomp_error=missingProperties" --compiler_flags="--jscomp_error=nonStandardJsDocs" --compiler_flags="--jscomp_error=strictModuleDepCheck" --compiler_flags="--jscomp_error=undefinedVars" --compiler_flags="--jscomp_error=unknownDefines" --compiler_flags="--jscomp_error=visibility"




css derlemesi için 

php -f frontend/scripts/merge.php | cat >> frontend/stylesheets/compressed/all.css



java -jar frontend/tools/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type css -o frontend/stylesheets/compressed/all.css frontend/stylesheets/compressed/all.css


