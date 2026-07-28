$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc1 = $word.Documents.Open("E:\sparsh\Plateful_Product_Features_Requirements by Kuldeep.docx")
$doc1.Content.Text | Out-File -Encoding utf8 "E:\sparsh\plateful\_tmp_features_req.txt"
$doc1.Close()

$doc2 = $word.Documents.Open("E:\sparsh\Project_Explanation.docx")
$doc2.Content.Text | Out-File -Encoding utf8 "E:\sparsh\plateful\_tmp_project_explanation.txt"
$doc2.Close()

$doc3 = $word.Documents.Open("E:\sparsh\Software Requirements Specification.docx")
$doc3.Content.Text | Out-File -Encoding utf8 "E:\sparsh\plateful\_tmp_srs.txt"
$doc3.Close()

$word.Quit()
