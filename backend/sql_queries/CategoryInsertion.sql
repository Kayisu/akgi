use db_akakce
INSERT INTO Category.category (category_name) 
VALUES
    ('Elektronik'),
    ('Ev & Ya�am'),
    ('Giyim'),
    ('Hobi'),
    ('Kozmetik'),
    ('S�permarket');


insert into Category.subcategory (category_id,subcategory_name) values
	-- Elektronik
	(1,'Beyaz E�ya'),
	(1,'Bilgisayar'),
	(1,'Oyun'),
	(1,'Telefon & Tablet'),
	(1,'TV & Ses- G�r�nt�'),
	-- Ev & Ya�am
	(2,'Dekorasyon'),
	(2,'Ev Gere�leri'),
	(2,'Hac ve Umre Malzemeleri'),
	(2,'Mobilya'),
	(2,'Tekstil'),
	-- Giyim
	(3,'Aksesuar'),
	(3,'Ayakkab�'),
	(3,'Giyim'),
	-- Hobi
	(4,'Kitap'),
	(4,'M�zik'),
	(4,'Oyun'),
	(4,'Resim'),
	-- Kozmetik
	(5,'Ki�isel Bak�m'),
	(5,'Sa�l�k �r�nleri'),
	-- S�permarket
	(6,'G�da'),
	(6,'Bebek Bak�m & Beslenme'),
	(6,'Evcil Hayvan'),
	(6,'Temizlik')

insert into Category.category_attributes(subcategory_id,attribute_name) values
	--Elektronik
	
	-- Beyaz E�ya
	(1,'Bula��k Makinesi'),
	(1,'Buzdolab�'),
	(1,'�ama��r Makinesi'),
	(1,'F�r�n'),
	(1,'Klima'),
	(1,'Mikrodalga F�r�n'),
	(1,'Ocak'),

	-- Bilgisayar
	(2,'Bilgisayar Aksesuarlar�'),
	(2,'Diz�st� Bilgisayar'),
	(2,'Masa�st� Bilgisayar'),
	(2,'Masa�st� Donan�m Bile�enleri'),
	(2,'Yaz�c� & Taray�c�'),
	(2,'Yaz�l�m'),

	-- Oyun
	(3,'Konsol Oyunlar�'),
	(3,'Oyun Konsolu'),
	(3,'Oyun Kolu'),
	(3,'Sanal Ger�eklik'),

	-- Tablet & Telefon
	(4,'Aksesuar'),
	(4,'Tablet'),
	(4,'Telefon'),

	-- TV & Ses- G�r�nt�
	(5,'Kamera'),
	(5,'Mikrofon'),
	(5,'Mp3 �alar'),
	(5,'Radyo'),
	(5,'Televizyon'),
	(5,'TV Aksesuarlar�'),

	-- Ev & Ya�am 

	--Dekorasyon
	(6,'Duvar Saati'),
	(6,'Minder'),
	(6,'Mum'),
	(6,'Sticker'),
	(6,'S�s'),

	-- Ev Gere�leri
	(7,'Ask�'),
	(7,'�ama��r Sepeti'),
	(7,'��p Kovas�'),
	(7,'Le�en'),
	(7,'Pazar Arabas�'),

	--Hac ve Umre Malzemeleri
	(8,'�hram'),
	(8,'Mest'),
	(8,'Seccade'),
	(8,'Tesbih'),
	(8,'Zikirmatik'),

	--Mobilya
	(9,'Dolap'),
	(9,'Koltuk'),
	(9,'Masa'),
	(9,'TV �nitesi'),
	(9,'Yatak'),

	--Tekstil
	(10,'Hal�'),
	(10,'Kilim'),
	(10,'Nevresim'),
	(10,'Perde'),
	(10,'Yast�k K�l�f�'),

	--Giyim

	--Aksesuar
	(11,'Alt�n'),
	(11,'Bileklik'),
	(11,'Kolye'),
	(11,'K�pte'),
	(11,'Y�z�k'),

	--Ayakkab�
	(12,'Bot'),
	(12,'G�nl�k'),
	(12,'Kundura'),
	(12,'Spor'),
	(12,'Topuklu'),
	
	--Giyim
	(13,'�ocuk'),
	(13,'Erkek'),
	(13,'Kad�n'),

	--Hobi

	--Kitap
	(14,'Aile'),
	(14,'Bilim'),
	(14,'Ders'),
	(14,'Felsefe'),
	(14,'Ki�isel Geli�im'),
	(14,'Roman'),

	--M�zik
	(15,'Alb�m/Plak') ,
	(15,'Piyano'),
	(15,'St�dyo'),
	(15,'Telli �alg� Aletleri'),

	--Oyun
	(16,'Kutu Oyunlar�'),
	(16,'Maket'),
	(16,'Satran�'),
	(16,'Tavla'),
	(16,'Yapboz'),
	(16,'Zeka K�p�'),

	--Resim
	(17,'F�r�a'),
	(17,'Kuru Boya'),
	(17,'Pastel'),
	(17,'Tuval'),
	(17,'Ya�l� Boya'),

	--Kozmetik

	--Ki�isel Bak�m
	(18,'Cilt Bak�m'),
	(18,'Krem'),
	(18,'Kuaf�r �r�nleri'),
	(18,'Makyaj �r�nleri'),
	(18,'Parf�m & Deodorant'),

	--Sa�l�k �r�nleri
	(19,'A��z & Di�'),
	(19,'Eczane �r�nleri'),
	(19,'Hijyen'),
	
	--S�permarket

	--Bebek Bak�m & Beslenme
	(20,'Bebek Mamas�'),
	(20,'Bebek �ampuan�'),
	(20,'Biberon'),
	(20,'Islak Mendil'),

	-- Evcil Hayvan
	(21,'Kedi'),
	(21,'K�pek'),
	(21,'Ku�'),
	(21,'S�r�ngen'),

	--G�da
	(22,'At��t�rmal�k'),
	(22,'Konserve'),
	(22,'Meyve & Sebze'),
	(22,'Temel G�dalar'),

	--Temizlik
	(23,'Deterjan'),
	(23,'Mendil'),
	(23,'Pe�ete'),
	(23,'Sabun')