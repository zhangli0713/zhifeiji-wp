<!DOCTYPE html><html>通告：本站功能还在完善中，现在处于开放测试阶段，游览遇到的问题，请邮件到jiangtao@80h-tv.com告诉我们，方便我们完善本站功能，谢谢你的支持和参与<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><?php	$options = get_option('mfthemes_options'); 	global $post;	if (is_home()){		$keywords = $options['keywords'];		$description = $options['description'];	}elseif (is_single()){		$keywords = get_post_meta($post->ID, "keywords", true);		if($keywords == ""){			$tags = wp_get_post_tags($post->ID);			foreach ($tags as $tag){				$keywords = $keywords.$tag->name.",";			}			$keywords = rtrim($keywords, ', ');		}		$description = get_post_meta($post->ID, "description", true);		if($description == ""){			if($post->post_excerpt){				$description = $post->post_excerpt;			}else{				$description = mb_strimwidth(strip_tags($post->post_content),0,200,'');			}		}	}elseif (is_page()){		$keywords = $options['keywords'];		$description = $options['description'];	}elseif (is_category()){		$keywords = single_cat_title('', false);		$description = category_description();	}elseif (is_tag()){		$keywords = single_tag_title('', false);		$description = tag_description();	}	$keywords = trim(strip_tags($keywords));	$description = trim(strip_tags($description));	?><?php if ( is_home()) { ?><title><?php bloginfo('name'); ?>&#160;&#45;&#160;<?php bloginfo('description'); ?></title><meta name="keywords" content="<?php echo $keywords; ?>" /><meta name="description" content="<?php echo $description; ?>" /><link href="<?php bloginfo('template_url');?>/assets/styles/index_list.css" type="text/css" rel="stylesheet"><link href="<?php bloginfo('template_url');?>/assets/styles/index_head.css" type="text/css" rel="stylesheet"><script type="text/javascript" data-main="<?php bloginfo('template_url');?>/assets/scripts/index_main.js?v=2014-02-11_11:35:04" src="<?php bloginfo('template_url');?>/assets/scripts/require.js"></script><script type='text/javascript' src='<?php bloginfo('template_url');?>/assets/scripts/jquery.js?ver=1.10.2'></script><?php $favicon =  $options['favicon'] ? $options['favicon'] : get_bloginfo('url')."/favicon.ico" ;?><link rel="shortcut icon" href="<?php echo $favicon;?>" type="image/x-icon" /><?php } ?><?php if ( is_archive()||is_search()||is_404()) { ?><title><?php wp_title(""); ?>&#160;&#45;&#160;<?php bloginfo('name'); ?></title><meta name="keywords" content="<?php echo $keywords; ?>" /><meta name="description" content="<?php echo $description; ?>" /><link href="<?php bloginfo('template_url');?>/assets/styles/archive.css" type="text/css" rel="stylesheet" /><script type="text/javascript" data-main="<?php bloginfo('template_url');?>/assets/scripts/archive_main.js?v=20140217174339" src="<?php bloginfo('template_url');?>/assets/scripts/require.js?v=v=20140217174339"></script><?php $favicon =  $options['favicon'] ? $options['favicon'] : get_bloginfo('url')."/favicon.ico" ;?><link rel="shortcut icon" href="<?php echo $favicon;?>" type="image/x-icon" /><?php } ?><?php if ( is_single()) { ?><title><?php echo trim(wp_title('',0)); ?>&#160;&#45;&#160;<?php bloginfo('description'); ?></title><meta name="keywords" content="<?php echo $keywords; ?>" /><meta name="description" content="<?php echo $description; ?>" /><?php $favicon =  $options['favicon'] ? $options['favicon'] : get_bloginfo('url')."/favicon.ico" ;?><link rel="shortcut icon" href="<?php echo $favicon;?>" type="image/x-icon" /><?php wp_head(); ?><link href="<?php bloginfo('template_url');?>/assets/styles/single.css" type="text/css" rel="stylesheet"><script type="text/javascript" src="<?php bloginfo('template_url');?>/player/player.js" charset="utf-8"></script><script type="text/javascript" src="<?php bloginfo('template_url');?>/comments-ajax.js"></script><link rel="stylesheet" id="index-css"  href="<?php bloginfo('template_url');?>/assets/styles/comments.css" type="text/css" media="screen" /><script src="<?php bloginfo('template_url');?>/assets/scripts/dz9.net.js"></script><?php $favicon =  $options['favicon'] ? $options['favicon'] : get_bloginfo('url')."/favicon.ico" ;?><link rel="shortcut icon" href="<?php echo $favicon;?>" type="image/x-icon" /><?php } ?></head>