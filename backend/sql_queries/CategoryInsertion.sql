use db_akakce
INSERT INTO Category.category (category_name) 
VALUES
    ('Elektronik'),
    ('Ev & Yaþam'),
    ('Giyim'),
    ('Hobi'),
    ('Kozmetik'),
    ('Süpermarket');


insert into Category.subcategory (category_id,subcategory_name) values
	-- Elektronik
	(1,'Beyaz Eþya'),
	(1,'Bilgisayar'),
	(1,'Oyun'),
	(1,'Telefon & Tablet'),
	(1,'TV & Ses- Görüntü'),
	-- Ev & Yaþam
	(2,'Dekorasyon'),
	(2,'Ev Gereçleri'),
	(2,'Hac ve Umre Malzemeleri'),
	(2,'Mobilya'),
	(2,'Tekstil'),
	-- Giyim
	(3,'Aksesuar'),
	(3,'Ayakkabý'),
	(3,'Giyim'),
	-- Hobi
	(4,'Kitap'),
	(4,'Müzik'),
	(4,'Oyun'),
	(4,'Resim'),
	-- Kozmetik
	(5,'Kiþisel Bakým'),
	(5,'Saðlýk Ürünleri'),
	-- Süpermarket
	(6,'Gýda'),
	(6,'Bebek Bakým & Beslenme'),
	(6,'Evcil Hayvan'),
	(6,'Temizlik')

insert into Category.category_attributes(subcategory_id,attribute_name) values
	--Elektronik
	
	-- Beyaz Eþya
	(1,'Bulaþýk Makinesi'),
	(1,'Buzdolabý'),
	(1,'Çamaþýr Makinesi'),
	(1,'Fýrýn'),
	(1,'Klima'),
	(1,'Mikrodalga Fýrýn'),
	(1,'Ocak'),

	-- Bilgisayar
	(2,'Bilgisayar Aksesuarlarý'),
	(2,'Dizüstü Bilgisayar'),
	(2,'Masaüstü Bilgisayar'),
	(2,'Masaüstü Donaným Bileþenleri'),
	(2,'Yazýcý & Tarayýcý'),
	(2,'Yazýlým'),

	-- Oyun
	(3,'Konsol Oyunlarý'),
	(3,'Oyun Konsolu'),
	(3,'Oyun Kolu'),
	(3,'Sanal Gerçeklik'),

	-- Tablet & Telefon
	(4,'Aksesuar'),
	(4,'Tablet'),
	(4,'Telefon'),

	-- TV & Ses- Görüntü
	(5,'Kamera'),
	(5,'Mikrofon'),
	(5,'Mp3 Çalar'),
	(5,'Radyo'),
	(5,'Televizyon'),
	(5,'TV Aksesuarlarý'),

	-- Ev & Yaþam 

	--Dekorasyon
	(6,'Duvar Saati'),
	(6,'Minder'),
	(6,'Mum'),
	(6,'Sticker'),
	(6,'Süs'),

	-- Ev Gereçleri
	(7,'Aský'),
	(7,'Çamaþýr Sepeti'),
	(7,'Çöp Kovasý'),
	(7,'Leðen'),
	(7,'Pazar Arabasý'),

	--Hac ve Umre Malzemeleri
	(8,'Ýhram'),
	(8,'Mest'),
	(8,'Seccade'),
	(8,'Tesbih'),
	(8,'Zikirmatik'),

	--Mobilya
	(9,'Dolap'),
	(9,'Koltuk'),
	(9,'Masa'),
	(9,'TV Ünitesi'),
	(9,'Yatak'),

	--Tekstil
	(10,'Halý'),
	(10,'Kilim'),
	(10,'Nevresim'),
	(10,'Perde'),
	(10,'Yastýk Kýlýfý'),

	--Giyim

	--Aksesuar
	(11,'Altýn'),
	(11,'Bileklik'),
	(11,'Kolye'),
	(11,'Küpte'),
	(11,'Yüzük'),

	--Ayakkabý
	(12,'Bot'),
	(12,'Günlük'),
	(12,'Kundura'),
	(12,'Spor'),
	(12,'Topuklu'),
	
	--Giyim
	(13,'Çocuk'),
	(13,'Erkek'),
	(13,'Kadýn'),

	--Hobi

	--Kitap
	(14,'Aile'),
	(14,'Bilim'),
	(14,'Ders'),
	(14,'Felsefe'),
	(14,'Kiþisel Geliþim'),
	(14,'Roman'),

	--Müzik
	(15,'Albüm/Plak') ,
	(15,'Piyano'),
	(15,'Stüdyo'),
	(15,'Telli Çalgý Aletleri'),

	--Oyun
	(16,'Kutu Oyunlarý'),
	(16,'Maket'),
	(16,'Satranç'),
	(16,'Tavla'),
	(16,'Yapboz'),
	(16,'Zeka Küpü'),

	--Resim
	(17,'Fýrça'),
	(17,'Kuru Boya'),
	(17,'Pastel'),
	(17,'Tuval'),
	(17,'Yaðlý Boya'),

	--Kozmetik

	--Kiþisel Bakým
	(18,'Cilt Bakým'),
	(18,'Krem'),
	(18,'Kuaför Ürünleri'),
	(18,'Makyaj Ürünleri'),
	(18,'Parfüm & Deodorant'),

	--Saðlýk Ürünleri
	(19,'Aðýz & Diþ'),
	(19,'Eczane Ürünleri'),
	(19,'Hijyen'),
	
	--Süpermarket

	--Bebek Bakým & Beslenme
	(20,'Bebek Mamasý'),
	(20,'Bebek Þampuaný'),
	(20,'Biberon'),
	(20,'Islak Mendil'),

	-- Evcil Hayvan
	(21,'Kedi'),
	(21,'Köpek'),
	(21,'Kuþ'),
	(21,'Sürüngen'),

	--Gýda
	(22,'Atýþtýrmalýk'),
	(22,'Konserve'),
	(22,'Meyve & Sebze'),
	(22,'Temel Gýdalar'),

	--Temizlik
	(23,'Deterjan'),
	(23,'Mendil'),
	(23,'Peçete'),
	(23,'Sabun')