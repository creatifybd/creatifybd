# CreatifyBD: বাংলা অভিজ্ঞতা ও ওয়েবসাইটের উন্নয়ন

এই পরিবর্তনগুলো GitHub-এ রিভিউয়ের জন্য প্রস্তুত করা হয়েছে। Hostinger-এর live website বা production Firestore-এ এই কাজ থেকে কোনো পরিবর্তন পাঠানো হয়নি।

## ইংরেজি থেকে বাংলায় বদলে যাওয়ার কারণ ও সমাধান

আগের ব্যবস্থায় প্রাথমিক লেখা ও Firestore থেকে পরে আসা লেখার মধ্যে একাধিক উৎস ছিল। প্রথমে একটি সংস্করণ দেখানো হতো; ডেটা আসার পরে তা বদলে যেত। কিছু পুরোনো sync ব্যবস্থা আবার নতুন লেখার ওপর defaults বসিয়ে দিতে পারত।

এখন ১৮টি public page-এর সম্পূর্ণ বাংলা HTML build-এর সময় তৈরি হয়। ব্রাউজার একই অনুমোদিত সংস্করণ দিয়ে কাজ শুরু করে। Public page আর editable Firestore document শুনে নিজের লেখা বদলায় না। Admin-এর পরিবর্তন খসড়া হিসেবে থাকে; পরের অনুমোদিত প্রকাশে একসঙ্গে আসে।

## কনটেন্ট ও ডিজাইন

- Hero-তে social media management-এর তিনটি প্যাকেজ: মাসে ৳৫,০০০ / ৳৭,০০০ / ৳১০,০০০। পোস্টার, ভিডিও ও প্ল্যাটফর্মের পরিমাণ একই তথ্য থেকে hero, pricing ও WhatsApp-এ যায়।
- Pricing নতুন করে সাজানো হয়েছে। মোবাইলে কার্ডগুলো একটির নিচে আরেকটি থাকবে; তুলনা ও কাজের পরিধির নোট আলাদা করে পড়া যায়।
- অনুবাদের মতো শোনানো লেখা বাদ দিয়ে প্রয়োজন, দায়িত্ব, কাজের ধাপ ও যোগাযোগকে কেন্দ্র করে বাংলা লেখা হয়েছে। যাচাইহীন ফলাফল বা বিক্রির নিশ্চয়তা যোগ করা হয়নি।
- প্রথমে কাজের নমুনা ও প্যাকেজ; পরে কাজের পদ্ধতি, সেবা, প্রতিষ্ঠাতার কথা ও যোগাযোগ। পরিচিত ব্যবসার বাস্তব প্রয়োজনকে সামনে রাখা হয়েছে।
- ১২টি নতুন বাংলা social poster: রেস্তোরাঁ, পোশাক, গ্যাজেট, বেকারি, গৃহস্থালি, আসবাব, ভ্রমণ, শিক্ষা, ব্যক্তিগত পরিচর্যা, আবাসন, দেশি খাবার ও হিসাবসেবা। নতুন সব কাজ স্পষ্টভাবে ধারণাভিত্তিক ডিজাইন হিসেবে চিহ্নিত।
- প্রকাশিত portfolio-তে মোট ৩৬টি কাজ: ২০টি social, ৫টি branding, ৪টি packaging, ৩টি web, ২টি video ও ২টি apparel। হোমপেজে নির্বাচিত ১২টির মধ্যে ৮টি social।
- চারটি নতুন service artwork ও official logo-এর ছোট WebP সংস্করণ যুক্ত হয়েছে। আগের portfolio artwork-এর মূল ফাইল অক্ষত রেখে responsive thumbnail তৈরি হয়েছে।
- Noto Sans Bengali স্থানীয়ভাবে পরিবেশন করা হচ্ছে। Google Fonts-এর অনুমোদিত source এবং OFL license রাখা হয়েছে। ডিজাইনের কাজের জন্য Hind Siliguri-ও ইনস্টল করা হয়েছে।

## মোবাইল ও ব্যবহারযোগ্যতা

ভারী animation, একসঙ্গে অতিরিক্ত ছবি, global smooth-scroll এবং public page-এর সঙ্গে admin dependencies লোড হওয়া সরানো হয়েছে। Gallery প্রথমে ১২টি কাজ দেখায়। প্রয়োজন অনুযায়ী আরও কাজ খোলা যায়। ছবির নির্দিষ্ট মাপ, ছোট স্ক্রিনের উপযোগী সংস্করণ এবং lazy loading আছে।

মোবাইল মেনু ও বড় ছবি দেখার জন্য native dialog, keyboard focus, reduced-motion সমর্থন এবং বড় touch control রাখা হয়েছে। ফর্মে বাজেট বা ইমেইল বাধ্যতামূলক নয়। বাংলা সংখ্যায় ফোন নম্বর দেওয়া যায়। পাঠাতে ব্যর্থ হলে লেখা থাকে; সফল হলে স্পষ্ট confirmation আসে।

## ডেটা ও প্রকাশ

পুরোনো public record মুছে ফেলার বদলে আর্কাইভ, বদলের আগে document backup, concurrent edit শনাক্ত করা, সম্পন্ন sync পুনরায় চালালে no-op এবং live release যাচাই করার ব্যবস্থা আছে। Admin Portfolio খুললেই স্বয়ংক্রিয়ভাবে পুরোনো লেখা লিখে দেওয়ার আচরণ সরানো হয়েছে।

অর্ডার, পেমেন্ট ও যোগাযোগের ডেটা পরিবর্তন করা হয় না। বিস্তারিত ধাপ ও recovery পদ্ধতি: [content-publishing.md](content-publishing.md)। ছবি তৈরির prompts ও পরিচয়: [artwork-provenance.json](artwork-provenance.json)।

## যাচাই ও সীমা

- ১৭টি unit check পাস: বাংলা কনটেন্টের validation, পুরোনো ইংরেজি প্রত্যাখ্যান, offer consistency, ভুল ফোন নম্বর, optional email, ব্যর্থ submission-এর পরে retry এবং error recovery।
- Firestore/Storage emulator-এ ৫টি integration scenario পাস: inquiry ও newsletter permission, admin roles, editor image upload, backup/archive/idempotency এবং অর্ডার-পেমেন্ট অক্ষত থাকা।
- Production build ও ১৮টি page-এর HTML পরীক্ষা পাস। শুরুতেই বাংলা heading, একটিমাত্র H1, main landmark, ছবির মাপ/ফাইল, release marker এবং public dependency budget যাচাই করা হয়েছে।
- মাপা homepage dependency graph প্রায় ৩০১ KB JavaScript + ২৪.৬ KB CSS; gzip-এ একসঙ্গে প্রায় ১০৩ KB। এটি ছবি, font ও HTML বাদে build-এর মাপ; ব্যবহারকারীর বাস্তব loading time নয়।
- ব্রাউজার প্রিভিউ পরিবেশে খোলা যায়নি। তাই নতুন layout-এর visual browser review, বাস্তব Android/iPhone পরীক্ষা এবং Lighthouse/Core Web Vitals ফলাফল এখনো বাকি। সব ডিভাইসে lag নেই—এমন দাবি করা হচ্ছে না।
- Production Firestore credential এই সেশনে পাওয়া যায়নি। Protected deployment secret, Storage-এর cross-service permission এবং App Check-এর অবস্থা যাচাই করে তারপর প্রকাশ করতে হবে।
- আগে source-এ থাকা AI provider keys বর্তমান code থেকে সরানো হয়েছে; provider-এর কাছে সেগুলো revoke/rotate করা বাকি।

## ভাষা ও টাইপোগ্রাফির ভিত্তি

আগের audit-এ পড়া প্রামাণ্য বাংলা শিক্ষা ও Bengali-script typography নির্দেশনা অনুসরণ করে পরিচিত শব্দ, স্বাভাবিক বাক্য, স্পষ্ট দায়িত্ব এবং অতিরঞ্জনহীন ভঙ্গি নেওয়া হয়েছে। শব্দে শব্দে ইংরেজি অনুবাদ না করে গ্রাহকের প্রয়োজন অনুযায়ী বক্তব্য লেখা হয়েছে।

Font source: [Google Fonts — Noto Sans Bengali](https://github.com/google/fonts/tree/main/ofl/notosansbengali), [Hind Siliguri](https://github.com/google/fonts/tree/main/ofl/hindsiliguri)। ব্যবহৃত checkout: `baa2e5561af8a4873b058859dcfe158bdd033942`। WOFF2 বানানোর সময় Bengali shaping অক্ষত রাখা হয়েছে; font subsetting করা হয়নি।
