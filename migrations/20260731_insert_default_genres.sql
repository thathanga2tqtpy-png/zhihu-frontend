-- File: insert_default_genres.sql
-- Thêm các thể loại dựa theo prompt phân loại (tags_classification)

INSERT INTO public.genres (name, slug, description) VALUES
  -- 1. Main Genres (Thể loại chính)
  ('Ngôn tình', 'ngon-tinh', 'Nam x Nữ'),
  ('Đam mỹ', 'dam-my', 'Nam x Nam'),
  ('Bách hợp', 'bach-hop', 'Nữ x Nữ'),
  ('Khác', 'khac', 'Các thể loại không thuộc 3 phân loại trên'),

  -- 2. Sub Genres (Thể loại phụ)
  ('Học đường', 'hoc-duong', 'Bối cảnh trường học, thanh xuân'),
  ('Vườn trường', 'vuon-truong', 'Tương tự Học đường, tuổi trẻ thanh xuân'),
  ('Kinh dị', 'kinh-di', 'Yếu tố rùng rợn, đáng sợ'),
  ('Đô thị', 'do-thi', 'Bối cảnh hiện đại, thành phố'),
  ('Cổ đại', 'co-dai', 'Bối cảnh thời xưa, lịch sử'),
  ('Đời thường', 'doi-thuong', 'Cuộc sống nhẹ nhàng, hằng ngày'),
  ('Xuyên không', 'xuyen-khong', 'Nhân vật đi tới một thế giới / thời đại khác'),
  ('Hệ thống', 'he-thong', 'Nhân vật có sự trợ giúp của hệ thống ảo'),
  ('Trọng sinh', 'trong-sinh', 'Nhân vật sống lại, quay về quá khứ'),
  ('Mạt thế', 'mat-the', 'Thế giới tận thế, zombie, thảm họa'),
  
  -- 2.1 Sub Genres phổ biến của truyện ngắn / Zhihu
  ('Gương vỡ lại lành', 'guong-vo-lai-lanh', 'Chia tay hoặc ly hôn rồi quay lại với nhau'),
  ('Hào môn', 'hao-mon', 'Bối cảnh gia đình giàu có, quyền thế'),
  ('Cưới trước yêu sau', 'cuoi-truoc-yeu-sau', 'Kết hôn trước vì lý do nào đó rồi mới nảy sinh tình cảm'),
  ('Thanh mai trúc mã', 'thanh-mai-truc-ma', 'Hai người quen biết, lớn lên cùng nhau từ nhỏ'),
  ('Truy thê hỏa táng tràng', 'truy-the-hoa-tang-trang', 'Nam chính lúc đầu hờ hững, sau hối hận theo đuổi lại vợ vô cùng vất vả'),
  ('Thế thân', 'the-than', 'Một người được xem là người thay thế cho người khác'),
  ('Sảng văn', 'sang-van', 'Truyện có tình tiết sảng khoái, vả mặt nhân vật phản diện'),
  ('Ngọt sủng', 'ngot-sung', 'Truyện ngọt ngào, nam/nữ chính cưng chiều nhau hết mực'),
  ('Ngược luyến', 'nguoc-luyen', 'Truyện có yếu tố đau khổ, dằn vặt về thể xác hoặc tinh thần'),
  ('Cung đấu', 'cung-dau', 'Đấu đá tranh giành quyền lực trong gia tộc hoặc hậu cung'),

  -- 3. Special Tags (Nhãn đặc biệt)
  ('Có H', 'co-h', 'Truyện có nội dung nhạy cảm, 18+, thịt thà'),
  ('Không H', 'khong-h', 'Truyện trong sáng, nhẹ nhàng, không có cảnh H'),
  ('Chưa xác định', 'chua-xac-dinh', 'Chưa rõ có yếu tố nhạy cảm hay không')
ON CONFLICT (slug) DO NOTHING;
