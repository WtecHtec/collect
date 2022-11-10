// 每个组的总人数
select count(*) , m.group_id, cg.group_name
from member m
left join class_group cg on cg.group_id = m.group_id
group by m.group_id


// 某个群单个通告上传图片情况
select m.member_name,ms.notice_id, ms.img_urls, m.group_id 
from member m
left join msg_collect ms on ms.create_id = m.user_id and ms.notice_id = '1b6f9914-1077-497e-8132-6c3ea1ce07b9'
where m.group_id = 'dc774e0f-1861-4695-9ddf-52b8e4fa394e'

// 获取个人创建的群
select cg.group_id 
from class_group cg
where cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'


//  某个群各个通告已上传图片总人数
select count(*), m.group_id,  ms.notice_id
from member m
left join notice_collect nc on nc.group_id = m.group_id
left join msg_collect ms on ms.create_id = m.user_id and ms.group_id = m.group_id and ms.notice_id = nc.notice_id
where m.group_id = 'dc774e0f-1861-4695-9ddf-52b8e4fa394e' and ms.img_urls != ''
group by ms.notice_id, m.group_id

select cg.group_id
from class_group cg 
left join notice_collect nc on nc.group_id = cg.group_id
where cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'

//  下发通知已收集情况总人数
select count(nc.notice_id) as collect_total, nc.group_id, mc.notice_id, nc.notice_title, nc.notice_desc
from notice_collect nc
left join msg_collect mc on  mc.group_id = nc.group_id and mc.notice_id = nc.notice_id
where nc.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' and nc.enable = 1 and mc.img_urls != ''
group by mc.notice_id, nc.group_id


// 用户创建每个群的总人数
select count(*) as group_total, m.group_id, cg.create_id
	from member m
	left join class_group cg on cg.group_id = m.group_id
	where cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'
	group by m.group_id


// 派生表 查找 总人数、已上传人数
select *
from ( select count(*) as group_total, m.group_id, cg.create_id
	from class_group cg
	left join member m  on cg.group_id = m.group_id
	where cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'
	group by m.group_id ) as gt
left join (
	select count(nc.notice_id) as collect_total, nc.group_id, mc.notice_id, nc.notice_title, nc.notice_desc
from notice_collect nc
left join msg_collect mc on  mc.group_id = nc.group_id and mc.notice_id = nc.notice_id
where nc.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' and nc.enable = 1 and mc.img_urls != ''
group by mc.notice_id, nc.group_id
)  as nt on nt.group_id = gt.group_id

