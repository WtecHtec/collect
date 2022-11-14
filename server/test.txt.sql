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




// 拉取 个人创建通知收集情况  （总人数、已上传人数）
select wg.group_id,  wg.group_name, wg.notice_id, wg.notice_title, nt.collect_total, gt.group_total, wg.create_time
from
(select cg.group_id , cg.group_name, nc.notice_id, nc.notice_title,nc.create_time  
	FROM  notice_collect nc  
	left join  class_group cg on nc.group_id  = cg.group_id and cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' 
  where nc.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' 
) as wg
left join  
  (
	select count(nc.notice_id) as collect_total, nc.group_id, mc.notice_id
	from notice_collect nc
	left join msg_collect mc on  mc.group_id = nc.group_id and mc.notice_id = nc.notice_id and nc.enable = 1 and mc.img_urls != ''
	where  nc.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' 
	group by mc.notice_id, nc.group_id
	)  as nt
on nt.group_id = wg.group_id and nt.notice_id = wg.notice_id
left join  
( select count(cg.group_id) as group_total, m.group_id
	from class_group cg
	left join member m  on cg.group_id = m.group_id
	where cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'
	group by m.group_id ) as gt
on gt.group_id = wg.group_id 
ORDER  by wg.create_time LIMIT 3



// 下发给本人的通知
SELECT  nc.notice_title , nc.notice_desc, nc.end_time , nc.update_time , nc.enable , cg.group_name , cg.group_id  FROM  notice_collect nc 
left join class_group cg on cg.group_id  = nc.group_id AND  cg.create_id  != 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'
left JOIN  `member` m  on m.group_id = nc.group_id AND m.group_id  = cg.group_id  and m.`level`  = 0 AND  m.user_id  = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs'
WHERE nc.create_id !='otrlc5XUmCRfBsYHd7lLlg3uAOUs'   and NOT ISNULL(cg.group_id)  ORDER  by  nc.update_time DESC 