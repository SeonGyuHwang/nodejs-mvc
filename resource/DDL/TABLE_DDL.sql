use nodejs_mvc;

create table board (
	board_pk int(11) unsigned auto_increment comment 'PK' primary key,
	board_title VARCHAR(100) not null comment '제목',
	board_content TEXT COMMENT '내용',
	writer_id VARCHAR(50) NOT NULL comment '작성자 아이디',
	writer_nickname VARCHAR(50) NOT NULL comment '작성자명',
	view_cnt INT(11) DEFAULT 0 comment '조회수',
	del_yn enum('Y', 'N') default 'N' comment '삭제여부',
	created_date DATETIME default CURRENT_TIMESTAMP not null,
	created_id VARCHAR(100) not null,
	updated_date DATETIME default null,
	updated_id VARCHAR(100) default null
) ENGINE=InnoDB CHARSET UTF8
;

create index writer_id_del_yn
	on board (writer_id, del_yn)
;
