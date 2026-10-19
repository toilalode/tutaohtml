# GOLD RULE — STRICT CODING, DEBUGGING & FILE MANAGEMENT
# QUY TẮC VÀNG — LẬP TRÌNH, GỠ LỖI VÀ QUẢN LÝ TỆP NGHIÊM NGẶT

## 1. NO NEW COMMENTS / KHÔNG THÊM COMMENT MỚI

**EN:**
- Never add new code comments, inline comments, explanatory comments, or commented-out code.
- Do not add comments to explain changes or describe implementation details.
- Write clean, self-explanatory code using meaningful names and clear structure.
- Preserve existing comments unless explicitly asked to remove them or removal is necessary.

**VI:**
- Tuyệt đối không thêm comment mới vào code, bao gồm comment trên cùng dòng, comment giải thích và code bị vô hiệu hóa bằng comment.
- Không thêm comment để giải thích thay đổi hoặc mô tả chi tiết triển khai.
- Viết code sạch, dễ hiểu thông qua tên biến, tên hàm có ý nghĩa và cấu trúc rõ ràng.
- Giữ nguyên comment hiện có, trừ khi người dùng yêu cầu xóa hoặc việc xóa là cần thiết.

## 2. ALWAYS CHECK CONSOLE LOGS / LUÔN KIỂM TRA CONSOLE LOG

**EN:**
- Inspect browser Developer Console, terminal output, build logs, and relevant runtime logs.
- Check for exceptions, failed network requests, missing resources, incorrect imports, warnings, and runtime errors.
- Reproduce the issue and identify its root cause before applying a fix whenever possible.
- Never assume the application works merely because the page renders or the build succeeds.
- After every fix, inspect the new logs again.

**VI:**
- Kiểm tra Browser Developer Console, đầu ra terminal, build logs và các runtime logs liên quan.
- Tìm lỗi ngoại lệ, request mạng thất bại, tài nguyên bị thiếu, import sai, cảnh báo và lỗi khi chạy.
- Khi có thể, hãy tái hiện lỗi và xác định nguyên nhân gốc trước khi sửa.
- Không được cho rằng ứng dụng hoạt động đúng chỉ vì trang hiển thị hoặc quá trình build thành công.
- Sau mỗi lần sửa, phải kiểm tra lại log mới.

## 3. AUTOMATICALLY FIX ERRORS / TỰ ĐỘNG SỬA LỖI

**EN:**
- Do not stop after identifying or reporting an error. Fix it directly whenever the required files and tools are available.
- Trace the root cause instead of applying superficial patches.
- Repeat the fix-and-test cycle until the issue is resolved or a genuine limitation blocks further progress.
- Do not hide errors, silence useful logs, disable features, or bypass validation merely to make checks pass.
- If an error cannot be fixed, explain the exact cause and what prevents the fix.

**VI:**
- Không được dừng lại sau khi phát hiện hoặc báo cáo lỗi. Hãy trực tiếp sửa lỗi khi có đủ tệp và công cụ cần thiết.
- Truy tìm nguyên nhân gốc thay vì chỉ vá lỗi bề mặt.
- Lặp lại quy trình sửa và kiểm tra cho đến khi lỗi được giải quyết hoặc có trở ngại thực sự ngăn cản việc tiếp tục.
- Không che giấu lỗi, tắt log hữu ích, vô hiệu hóa tính năng hoặc bỏ qua bước xác thực chỉ để khiến các bài kiểm tra thành công.
- Nếu không thể sửa lỗi, phải nêu rõ nguyên nhân và trở ngại cụ thể.

## 4. INSPECT EVERY MODIFIED FILE / KIỂM TRA LẠI MỌI TỆP ĐÃ SỬA

**EN:**
- Reopen and inspect the complete contents of every modified file after editing.
- Verify syntax, imports, exports, variable references, function calls, dependencies, file paths, and compatibility with surrounding code.
- Review the actual diff and check for accidental deletions, duplicated logic, incomplete changes, and unrelated modifications.
- Confirm that existing features and required logic remain intact.
- Do not assume a file is correct just because the editor or patch operation reports success.

**VI:**
- Mở lại và kiểm tra toàn bộ nội dung của từng tệp sau khi chỉnh sửa.
- Xác minh cú pháp, import, export, tham chiếu biến, lời gọi hàm, dependency, đường dẫn tệp và khả năng tương thích với code xung quanh.
- Kiểm tra diff thực tế để phát hiện việc xóa nhầm, logic trùng lặp, thay đổi chưa hoàn chỉnh hoặc sửa những phần không liên quan.
- Đảm bảo các tính năng hiện có và logic cần thiết vẫn được giữ nguyên.
- Không được cho rằng tệp đã đúng chỉ vì trình chỉnh sửa hoặc thao tác patch báo thành công.

## 5. CLASSIFY FILES BEFORE EDITING / PHÂN LOẠI TỆP TRƯỚC KHI SỬA

**EN:**
- Identify each relevant file's type, purpose, responsibility, dependencies, and role in the project before editing.
- Distinguish source code, UI components, stylesheets, configuration files, assets, data files, tests, build scripts, generated files, and documentation.
- Trace imports, references, and execution flow to determine the correct file for each change.
- Follow the existing architecture, naming conventions, directory structure, and module boundaries.
- Do not place unrelated logic in the wrong file or duplicate functionality across modules.
- Avoid modifying generated files, dependencies, build output, or lockfiles unless the task genuinely requires it.

**VI:**
- Trước khi sửa, xác định loại tệp, mục đích, trách nhiệm, dependency và vai trò của từng tệp liên quan trong dự án.
- Phân biệt code nguồn, thành phần giao diện, stylesheet, tệp cấu hình, tài nguyên, dữ liệu, tệp kiểm thử, script build, tệp được tạo tự động và tài liệu.
- Truy vết import, tham chiếu và luồng thực thi để xác định đúng tệp cần sửa.
- Tuân thủ kiến trúc, quy tắc đặt tên, cấu trúc thư mục và ranh giới giữa các module hiện có.
- Không đặt logic không liên quan vào sai tệp hoặc tạo chức năng trùng lặp giữa các module.
- Tránh sửa tệp được tạo tự động, dependency, đầu ra build hoặc lockfile, trừ khi nhiệm vụ thực sự yêu cầu.

## 6. MANDATORY WORKFLOW / QUY TRÌNH BẮT BUỘC

**EN — Follow every applicable step in order:**
1. Inspect the project structure.
2. Classify relevant files and identify dependencies.
3. Read the existing implementation and trace the execution flow.
4. Identify the requirements and root cause.
5. Make the smallest complete and correct changes.
6. Reopen and inspect every modified file in full.
7. Review the diff for unintended changes.
8. Run relevant syntax checks, linting, type checks, tests, and builds.
9. Run the application and reproduce the affected workflow whenever possible.
10. Inspect console logs, terminal output, network failures, and runtime behavior.
11. Fix newly discovered errors and repeat the relevant checks.
12. Perform a final regression check and report verified results.

**VI — Thực hiện đầy đủ các bước phù hợp theo đúng thứ tự:**
1. Kiểm tra cấu trúc dự án.
2. Phân loại các tệp liên quan và xác định dependency.
3. Đọc code hiện có và truy vết luồng thực thi.
4. Xác định yêu cầu và nguyên nhân gốc.
5. Thực hiện thay đổi nhỏ nhất nhưng đầy đủ và chính xác.
6. Mở lại và kiểm tra toàn bộ từng tệp đã sửa.
7. Kiểm tra diff để phát hiện thay đổi ngoài ý muốn.
8. Chạy các bước kiểm tra cú pháp, lint, kiểu dữ liệu, test và build có liên quan.
9. Chạy ứng dụng và tái hiện quy trình bị ảnh hưởng khi có thể.
10. Kiểm tra console log, đầu ra terminal, lỗi mạng và hành vi khi chạy.
11. Sửa các lỗi mới phát hiện và lặp lại những bước kiểm tra liên quan.
12. Kiểm tra hồi quy lần cuối và báo cáo kết quả đã xác minh.

## 7. NEVER CLAIM UNVERIFIED SUCCESS / KHÔNG BÁO CÁO THÀNH CÔNG KHI CHƯA XÁC MINH

**EN:**
- Never claim that a fix works, a test passes, or a file has been verified unless the corresponding check was actually performed.
- If the environment prevents browser inspection, execution, testing, or access to required dependencies, clearly state the limitation.
- Distinguish verified facts from assumptions.
- A successful build does not prove that runtime behavior is correct.

**VI:**
- Không được tuyên bố đã sửa thành công, test đã đạt hoặc tệp đã được xác minh nếu chưa thực sự thực hiện bước kiểm tra tương ứng.
- Nếu môi trường không cho phép kiểm tra trình duyệt, chạy ứng dụng, thực hiện test hoặc truy cập dependency cần thiết, phải nêu rõ giới hạn đó.
- Phân biệt kết quả đã xác minh với những điều mới chỉ là giả định.
- Build thành công không đồng nghĩa với việc ứng dụng hoạt động đúng khi chạy.

## 8. PRESERVE EXISTING FUNCTIONALITY / BẢO TOÀN CHỨC NĂNG HIỆN CÓ

**EN:**
- Do not rewrite unrelated modules or make unnecessary architectural changes.
- Do not remove existing features, event handlers, validations, error handling, responsive behavior, or integrations without a valid reason.
- Ensure every change is compatible with the existing project.
- Prefer complete, maintainable root-cause fixes over temporary workarounds.

**VI:**
- Không viết lại các module không liên quan hoặc thực hiện thay đổi kiến trúc không cần thiết.
- Không xóa tính năng, event handler, bước xác thực, xử lý lỗi, khả năng responsive hoặc tích hợp hiện có nếu không có lý do chính đáng.
- Đảm bảo mọi thay đổi tương thích với dự án hiện tại.
- Ưu tiên sửa triệt để nguyên nhân gốc, dễ bảo trì thay vì sử dụng giải pháp tạm thời.

## 9. DEFINITION OF DONE / ĐIỀU KIỆN HOÀN THÀNH

**EN:**
A task is complete only after relevant files have been classified, changes have been implemented and reviewed, modified files have been re-inspected, available checks have been run, console and runtime errors have been investigated, and discovered issues have been fixed or explicitly documented as blocked. Never skip applicable verification steps merely to finish faster.

**VI:**
Một nhiệm vụ chỉ được xem là hoàn thành sau khi các tệp liên quan đã được phân loại, thay đổi đã được thực hiện và rà soát, các tệp đã sửa đã được kiểm tra lại, những bước kiểm tra khả dụng đã được chạy, lỗi console và runtime đã được điều tra, đồng thời các lỗi phát hiện được đã được sửa hoặc ghi rõ là bị chặn bởi trở ngại cụ thể. Không được bỏ qua các bước xác minh phù hợp chỉ để hoàn thành nhanh hơn.
