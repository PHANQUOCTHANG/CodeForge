INSERT INTO CodingProblems 
(Title, Slug, Difficulty, Description, Tags, FunctionName, Parameters, ReturnType, Notes, Constraints)
VALUES
(N'Tính tổng hai số', N'tinh-tong-hai-so', N'Dễ',
 N'Viết hàm nhận vào hai số nguyên và trả về tổng của chúng.',
 N'toán học,cơ bản',
 N'calculateSum', N'int a, int b', N'int',
 N'Lưu ý kiểm tra tràn số.', 
 N'0 ≤ a,b ≤ 10^9'),

(N'Kiểm tra số nguyên tố', N'kiem-tra-so-nguyen-to', N'Dễ',
 N'Viết hàm kiểm tra một số nguyên dương có phải là số nguyên tố hay không.',
 N'toán học,số học',
 N'isPrime', N'int n', N'bool',
 N'Nhớ điều kiện n >= 2.', 
 N'1 ≤ n ≤ 10^7'),

(N'Đảo ngược chuỗi', N'dao-nguoc-chuoi', N'Dễ',
 N'Cho một chuỗi, hãy trả về chuỗi đã được đảo ngược.',
 N'chuỗi,string',
 N'reverseString', N'string s', N'string',
 N'Không dùng hàm Reverse() có sẵn.', 
 N'1 ≤ length(s) ≤ 10^5'),

(N'Tìm giá trị lớn nhất trong mảng', N'tim-max-trong-mang', N'Trung bình',
 N'Cho một mảng số nguyên, hãy tìm phần tử lớn nhất.',
 N'mảng,array',
 N'findMax', N'int[] arr', N'int',
 N'Mảng có ít nhất 1 phần tử.', 
 N'1 ≤ length(arr) ≤ 10^5'),

(N'Tính giai thừa', N'tinh-giai-thua', N'Trung bình',
 N'Viết hàm tính n! với n là số nguyên không âm.',
 N'toán học,giai thừa',
 N'factorial', N'int n', N'long',
 N'Không tính bằng đệ quy để tránh tràn stack.', 
 N'0 ≤ n ≤ 20'),

(N'Kiểm tra chuỗi Palindrome', N'kiem-tra-palindrome', N'Trung bình',
 N'Xác định xem một chuỗi có phải là Palindrome hay không.',
 N'chuỗi,kiểm tra',
 N'isPalindrome', N'string s', N'bool',
 N'Bỏ qua khoảng trắng và ký tự đặc biệt.', 
 N'1 ≤ length(s) ≤ 10^5'),

(N'Sắp xếp mảng tăng dần', N'sap-xep-mang-tang-dan', N'Trung bình',
 N'Viết hàm sắp xếp mảng số nguyên theo thứ tự tăng dần.',
 N'mảng,thuật toán',
 N'sortArray', N'int[] arr', N'int[]',
 N'Không dùng Sort() có sẵn.', 
 N'1 ≤ length(arr) ≤ 10^5'),

(N'Tính tổng chữ số', N'tinh-tong-chu-so', N'Dễ',
 N'Cho một số nguyên dương, hãy tính tổng các chữ số của nó.',
 N'số học',
 N'sumDigits', N'int n', N'int',
 N'Dùng phép mod và chia 10.', 
 N'1 ≤ n ≤ 10^18'),

(N'Tìm số Fibonacci thứ n', N'tim-fibonacci-thu-n', N'Trung bình',
 N'Trả về số Fibonacci thứ n (F0 = 0, F1 = 1).',
 N'fibonacci,đệ quy',
 N'fib', N'int n', N'long',
 N'Dùng vòng lặp để tránh TLE.', 
 N'0 ≤ n ≤ 92'),

(N'Đếm số lần xuất hiện ký tự', N'dem-so-lan-xuat-hien-ky-tu', N'Dễ',
 N'Viết hàm đếm số lần xuất hiện của một ký tự trong chuỗi.',
 N'chuỗi,string',
 N'countChar', N'string s, char c', N'int',
 N'Phân biệt chữ hoa/thường.', 
 N'1 ≤ length(s) ≤ 10^5');


 Delete from TestCases ;
Select * from TestCases ;

-----------------------------------------------------
-- 1️⃣ Tìm số Fibonacci thứ n
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":5}', '5', N'F5 = 5', 0),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":10}', '55', N'F10 = 55', 0),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":1}', '1', N'F1 = 1', 1),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":20}', '6765', N'F20 = 6765', 1);


-----------------------------------------------------
-- 2️⃣ Kiểm tra Palindrome
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"level"}', 'true', N'Là palindrome', 0),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"abc"}', 'false', N'Không đối xứng', 0),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"Aba"}', 'false', N'Phân biệt hoa thường', 1),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"racecar"}', 'true', N'Palindrome chuẩn', 1);


-----------------------------------------------------
-- 3️⃣ Sắp xếp mảng tăng dần
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[3,1,2]}', '[1,2,3]', N'Cơ bản', 0),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[5,5,1]}', '[1,5,5]', N'Có trùng', 0),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[-1,0,2]}', '[-1,0,2]', N'Có số âm', 1),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[9]}', '[9]', N'Mảng 1 phần tử', 1);


-----------------------------------------------------
-- 4️⃣ Tìm giá trị lớn nhất trong mảng
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[1,5,3]}', '5', N'Max = 5', 0),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[-1,-3,-2]}', '-1', N'Max âm', 0),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[100]}', '100', N'Một phần tử', 1),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[0,50,20]}', '50', N'Max = 50', 1);


-----------------------------------------------------
-- 5️⃣ Tính giai thừa
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":5}', '120', N'5! = 120', 0),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":0}', '1', N'0! = 1', 0),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":7}', '5040', N'7! = 5040', 1),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":1}', '1', N'1! = 1', 1);


-----------------------------------------------------
-- 6️⃣ Đếm ký tự xuất hiện
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"hello","c":"l"}', '2', N'Có 2 chữ l', 0),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"aaab","c":"a"}', '3', N'3 chữ a', 0),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"abc","c":"x"}', '0', N'Không xuất hiện', 1),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"AAAA","c":"A"}', '4', N'Phân biệt hoa thường', 1);


-----------------------------------------------------
-- 7️⃣ Kiểm tra số nguyên tố
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":7}', 'true', N'7 là số nguyên tố', 0),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":8}', 'false', N'8 không phải số nguyên tố', 0),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":1}', 'false', N'1 không phải số nguyên tố', 1),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":97}', 'true', N'97 là số nguyên tố lớn', 1);


-----------------------------------------------------
-- 8️⃣ Tính tổng hai số
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":3,"b":4}', '7', N'3+4=7', 0),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":10,"b":20}', '30', N'10+20=30', 0),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":-1,"b":5}', '4', N'Có số âm', 1),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":0,"b":0}', '0', N'0+0=0', 1);


-----------------------------------------------------
-- 9️⃣ Tính tổng chữ số
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":123}', '6', N'1+2+3', 0),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":987}', '24', N'9+8+7', 0),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":5}', '5', N'Một chữ số', 1),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":1001}', '2', N'1+0+0+1', 1);


-----------------------------------------------------
-- 🔟 Đảo ngược chuỗi
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"abc"}', 'cba', N'Cơ bản', 0),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"hello"}', 'olleh', N'Phổ biến', 0),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"A"}', 'A', N'Một ký tự', 1),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"12345"}', '54321', N'Dãy số', 1);