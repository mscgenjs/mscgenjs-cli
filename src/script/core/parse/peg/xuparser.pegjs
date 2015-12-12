/*
 * parser for xù (messsage sequence chart language)
 * 
 * xù is an extension of mscgen, which means each valid mscgen 
 * script is also a valid xù script
 * 
 * see https://github.com/sverweij/mscgen_js/wikum/xu.md for more information
 * - mscgen cannot handle entity names that are also keywords
 *   (box, abox, rbox, note, msc, hscale, width, arcgradient,
 *   wordwraparcs, label, color, idurl, id, url,
 *   linecolor, linecolour, textcolor, textcolour,
 *   textbgcolor, textbgcolour, arclinecolor, arclinecolour,
 *   arctextcolor, arctextcolour,arctextbgcolor, arctextbgcolour,
 *   arcskip). This grammar does allow them. 
 */

{
    function mergeObject (pBase, pObjectToMerge){
        if (pObjectToMerge){
            Object.getOwnPropertyNames(pObjectToMerge).forEach(function(pAttribute){
                pBase[pAttribute] = pObjectToMerge[pAttribute];
            });
        }
    }
        
    function merge(pBase, pObjectToMerge){
        pBase = pBase ? pBase : {};
        mergeObject(pBase, pObjectToMerge);
        return pBase;
    }

    function optionArray2Object (pOptionList) {
        var lOptionList = {};
        pOptionList[0].forEach(function(lOption){
            lOptionList = merge(lOptionList, lOption);
        });
        return merge(lOptionList, pOptionList[1]);
    }

    function flattenBoolean(pBoolean) {
        return (["true", "on", "1"].indexOf(pBoolean.toLowerCase()) > -1).toString();
    }

    function entityExists (pEntities, pName) {
        return pName === undefined || pName === "*" || pEntities.entities.some(function(pEntity){
            return pEntity.name === pName;
        });
    }

    function buildEntityNotDefinedMessage(pEntityName, pArc){
        return "Entity '" + pEntityName + "' in arc " +
               "'" + pArc.from + " " + pArc.kind + " " + pArc.to + "' " +
               "is not defined.";    
    }

    function EntityNotDefinedError (pEntityName, pArc) {
        this.name = "EntityNotDefinedError";
        this.message = buildEntityNotDefinedMessage(pEntityName, pArc);
        /* istanbul ignore else  */
        if(!!pArc.location){
            this.location = pArc.location;
            this.location.start.line++;
            this.location.end.line++;        
        }
    }

    function checkForUndeclaredEntities (pEntities, pArcLineList) {
        if (!pEntities) {
            pEntities = {};
            pEntities.entities = [];
        }
        if (pArcLineList && pArcLineList.arcs) {
            pArcLineList.arcs.forEach(function(pArcLine) {
                pArcLine.forEach(function(pArc) {
                    if (pArc.from && !entityExists (pEntities, pArc.from)) {
                        throw new EntityNotDefinedError(pArc.from, pArc);
                    }
                    if (pArc.to && !entityExists (pEntities, pArc.to)) {
                        throw new EntityNotDefinedError(pArc.to, pArc);
                    }
                    if (!!pArc.location) {
                        delete pArc.location;
                    }
                    if (!!pArc.arcs){
                        checkForUndeclaredEntities(pEntities, pArc);
                    }
                });
            });
        }
        return pEntities;
    }

    function hasExtendedOptions (pOptions){
        if (pOptions && pOptions.options){
            return pOptions.options["watermark"] ? true : false;
        } else {
            return false;
        }
    }

    function hasExtendedArcTypes(pArcLineList){
        if (pArcLineList && pArcLineList.arcs){
            return pArcLineList.arcs.some(function(pArcLine){
                return pArcLine.some(function(pArc){
                    return (["alt", "else", "opt", "break", "par",
                      "seq", "strict", "neg", "critical",
                      "ignore", "consider", "assert",
                      "loop", "ref", "exc"].indexOf(pArc.kind) > -1);
                });
            });
        }
        return false;
    }

    function getMetaInfo(pOptions, pArcLineList){
        var lHasExtendedOptions  = hasExtendedOptions(pOptions);
        var lHasExtendedArcTypes = hasExtendedArcTypes(pArcLineList);
        return {
            "extendedOptions" : lHasExtendedOptions,
            "extendedArcTypes": lHasExtendedArcTypes,
            "extendedFeatures": lHasExtendedOptions||lHasExtendedArcTypes
        }
    }
}

program         =  pre:_ starttoken _  "{" _ d:declarationlist _ "}" _
{
    d[1] = checkForUndeclaredEntities(d[1], d[2]);
    var lRetval = merge (d[0], merge (d[1], d[2]));
    
    lRetval = merge ({meta: getMetaInfo(d[0], d[2])}, lRetval);

    if (pre.length > 0) {
        lRetval = merge({precomment: pre}, lRetval);
    }


/*
    if (post.length > 0) {
        lRetval = merge(lRetval, {postcomment:post});
    }
*/
    return lRetval;
}

starttoken      = "msc"i / "xu"i

declarationlist = (o:optionlist {return {options:o}})?
                  (e:entitylist {return {entities:e}})?
                  (a:arclist {return {arcs:a}})?
optionlist      = options:((o:option "," {return o})*
                  (o:option ";" {return o}))
{
  return optionArray2Object(options);
}

option          = _ name:optionname _ "=" _
                  value:(s:string {return s}
                     / i:number {return i.toString()}
                     / b:boolean {return b.toString()}) _
{
   var lOption = {};
   name = name.toLowerCase();
   if (name === "wordwraparcs"){
      lOption[name] = flattenBoolean(value);
   } else {
      lOption[name]=value;
   }
   return lOption;
}
optionname      = "hscale"i / "width"i / "arcgradient"i
                  /"wordwraparcs"i / "watermark"i
entitylist      = el:((e:entity "," {return e})* (e:entity ";" {return e}))
{
  el[0].push(el[1]);
  return el[0];
}
entity "entity" =  _ name:identifier _ attrList:("[" a:attributelist  "]" {return a})? _
{
  return merge ({name:name}, attrList);
}
arclist         = (a:arcline _ ";" {return a})+
arcline         = al:((a:arc _ "," {return a})* (a:arc {return [a]}))
{
   al[0].push(al[1][0]);

   return al[0];
}
arc             = regulararc / spanarc
regulararc      = a:((a:singlearc {return a})
                   / (a:dualarc {return a})
                   / (a:commentarc {return a}))
                      al:("[" al:attributelist "]" {return al})?
{
  return merge (a, al);
}

singlearc       = _ kind:singlearctoken _ {return {kind:kind}}
commentarc      = _ kind:commenttoken _ {return {kind:kind}}
dualarc         =
 (_ from:identifier _ kind:dualarctoken _ to:identifier _
  {return {kind: kind, from:from, to:to, location:location()}})
/(_ "*" _ kind:bckarrowtoken _ to:identifier _
  {return {kind:kind, from: "*", to:to, location:location()}})
/(_ from:identifier _ kind:fwdarrowtoken _ "*" _
  {return {kind:kind, from: from, to:"*", location:location()}})
/(_ from:identifier _ kind:bidiarrowtoken _ "*" _
  {return {kind:kind, from: from, to:"*", location:location()}})
spanarc         =
 (_ from:identifier _ kind:spanarctoken _ to:identifier _ al:("[" al:attributelist "]" {return al})? _ "{" _ arclist:arclist? _ "}" _
  {
    var lRetval = {kind: kind, from:from, to:to, location:location(), arcs:arclist};
    return merge (lRetval, al);
  }
 )

singlearctoken  = "|||" / "..."
commenttoken    = "---"
dualarctoken    = kind:(
                    bidiarrowtoken/ fwdarrowtoken / bckarrowtoken
                  / boxtoken )
                 {return kind.toLowerCase()}
bidiarrowtoken   "bi-directional arrow"
                =   "--"  / "<->"
                  / "=="  / "<<=>>"
                          / "<=>"
                  / ".."  / "<<>>"
                  / "::"  / "<:>"
fwdarrowtoken   "left to right arrow"
                = "->" / "=>>"/ "=>" / ">>"/ ":>" / "-x"i
bckarrowtoken   "right to left arrow"
                = "<-" / "<<=" / "<=" / "<<" / "<:" / "x-"i
boxtoken        "box"
                = "note"i / "abox"i / "rbox"i / "box"i
spanarctoken    "arc spanning box"
                = kind:("alt"i / "else"i/ "opt"i / "break"i /"par"i
                  / "seq"i / "strict"i / "neg"i / "critical"i
                  / "ignore"i / "consider"i / "assert"i
                  / "loop"i / "ref"i / "exc"i
                  )
                 {return kind.toLowerCase()}

attributelist   = attributes:((a:attribute "," {return a})* (a:attribute {return a}))
{
  return optionArray2Object(attributes);
}

attribute       = _ name:attributename _ "=" _ value:identifier _
{
  var lAttribute = {};
  name = name.toLowerCase();
  name = name.replace("colour", "color");
  lAttribute[name] = value;
  return lAttribute
}
attributename  "attribute name"
                =  "label"i / "idurl"i/ "id"i / "url"i
                  / "linecolor"i / "linecolour"i
                  / "textcolor"i / "textcolour"i
                  / "textbgcolor"i / "textbgcolour"i
                  / "arclinecolor"i / "arclinecolour"i
                  / "arctextcolor"i / "arctextcolour"i
                  / "arctextbgcolor"i / "arctextbgcolour"i
                  / "arcskip"i

string          = '"' s:stringcontent '"' {return s.join("")}
stringcontent   = (!'"' c:('\\"'/ .) {return c})*

identifier "identifier"
 = (letters:([A-Za-z_0-9])+ {return letters.join("")})
  / string

whitespace "whitespace"
                = c:[ \t] {return c}
lineend "lineend"
                = c:[\r\n] {return c}
mlcomstart      = "/*"
mlcomend        = "*/"
mlcomtok        = !"*/" c:. {return c}
mlcomment       = start:mlcomstart com:(mlcomtok)* end:mlcomend
{
  return start + com.join("") + end
}
slcomstart      = "//" / "#"
slcomtok        = [^\r\n]
slcomment       = start:(slcomstart) com:(slcomtok)*
{
  return start + com.join("")
}
comment "comment"
                =   slcomment
                  / mlcomment
_               = (whitespace / lineend / comment)*

number = real / integer
integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

real "real"
  = digits:([0-9]+ "." [0-9]+) { return parseFloat(digits.join("")); }

boolean "boolean"
  = "true"i / "false"i/ "on"i/ "off"i

/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */