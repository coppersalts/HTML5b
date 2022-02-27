var dom = fl.getDocumentDOM();
var sel = dom.selection[0];
var mat = sel.matrix;
fl.trace("a:"+mat.a+",b:"+mat.b+",c:"+mat.c+",d:"+mat.d+",tx:"+mat.tx+",ty:"+mat.ty);