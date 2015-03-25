# scratch-ext-prec-ops
Enhanced-Precision Operators Extension for Scratch

The EPO extension shall be used only for enhancing the use of the Scratch online player.
If you have Flash installed, you may use the Scratch player in any web browser. To install
this extension, add a bookmark to your browser with the following link:  

`javascript:(function(){var%20epo=document.createElement('script');s.setAttribute('src','https://cdn.rawgit.com/Zro617/scratch-ext-prec-ops/bdbb24ca8f6fddd5324462e2de4ea4eb1a4b6cde/ext-prec-ops.js');document.body.appendChild(epo);})();`

When you want to use it, click the bookmark when on any Scratch project webpage.  

Or, if you prefer to load it from the console, use this:  

`ScratchExtensions.loadExternalJS('https://cdn.rawgit.com/Zro617/scratch-ext-prec-ops/bdbb24ca8f6fddd5324462e2de4ea4eb1a4b6cde/ext-prec-ops.js');`  
*The link is subject to frequent change*

I apologize if you are unable to install the extension as a result of future updates to
the Scratch online player.  

The EPO extension supplies the following blocks to the editor (last updated 3/24/2015)  

STACKS:
  * set precision to ()
  * calculate pi to () digits
  
BOOLEANS:
  * installed?
  * [] is [positive/negative/zero]?
  * [] is [integer/decimal/NaN/infinity]?
  
ENHANCED OPERATORS:
  * precision
  * pi
  * [] + []
  * [] - []
  * [] * []
  * [] / []
  * [] ^ []
  * [] mod []
  * []!
  * sqrt of []
  * abs of []
  * round []
  * trim []
  * negate []
  * decimal places of []
  * integer places of []
