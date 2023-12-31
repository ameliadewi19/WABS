PGDMP  7    '            
    {            wabs    16.0    16.0 )               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16630    wabs    DATABASE     {   CREATE DATABASE wabs WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE wabs;
                postgres    false            �            1259    16652    Activity    TABLE     �   CREATE TABLE public."Activity" (
    id integer NOT NULL,
    nama_kegiatan character varying(150) NOT NULL,
    tanggal_kegiatan date NOT NULL,
    keterangan text NOT NULL
);
    DROP TABLE public."Activity";
       public         heap    postgres    false            �            1259    16651    Activity_id_seq    SEQUENCE     �   ALTER TABLE public."Activity" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Activity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    16669    HistorySchedule    TABLE       CREATE TABLE public."HistorySchedule" (
    id integer NOT NULL,
    id_schedule integer NOT NULL,
    nama character varying(150) NOT NULL,
    no_whatsapp character varying(15) NOT NULL,
    status character varying(20) NOT NULL,
    "timestamp" time without time zone NOT NULL
);
 %   DROP TABLE public."HistorySchedule";
       public         heap    postgres    false            �            1259    16668    HistoryMessage_id_seq    SEQUENCE     �   ALTER TABLE public."HistorySchedule" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."HistoryMessage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    227            �            1259    16638 	   Recipient    TABLE     �   CREATE TABLE public."Recipient" (
    id integer NOT NULL,
    nama character varying(150) NOT NULL,
    no_whatsapp character varying(15) NOT NULL
);
    DROP TABLE public."Recipient";
       public         heap    postgres    false            �            1259    16637    Recipien_id_seq    SEQUENCE     �   ALTER TABLE public."Recipient" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Recipien_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            �            1259    16665    RecipientList    TABLE     m   CREATE TABLE public."RecipientList" (
    id_schedule integer NOT NULL,
    id_recipient integer NOT NULL
);
 #   DROP TABLE public."RecipientList";
       public         heap    postgres    false            �            1259    16660    Schedule    TABLE       CREATE TABLE public."Schedule" (
    id integer NOT NULL,
    id_message integer NOT NULL,
    jenis_message character varying(20) NOT NULL,
    id_activity integer,
    jenis_schedule character varying(20) NOT NULL,
    tanggal_mulai date NOT NULL,
    tanggal_akhir date NOT NULL
);
    DROP TABLE public."Schedule";
       public         heap    postgres    false            �            1259    16659    Schedule_id_seq    SEQUENCE     �   ALTER TABLE public."Schedule" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    224            �            1259    16644    TemplateMessage    TABLE     �   CREATE TABLE public."TemplateMessage" (
    id integer NOT NULL,
    jenis_template character varying(20) NOT NULL,
    message text NOT NULL
);
 %   DROP TABLE public."TemplateMessage";
       public         heap    postgres    false            �            1259    16643    TemplateMessage_id_seq    SEQUENCE     �   ALTER TABLE public."TemplateMessage" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."TemplateMessage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    16631    User    TABLE     �   CREATE TABLE public."User" (
    id integer NOT NULL,
    username character varying(150) NOT NULL,
    password character varying(150) NOT NULL
);
    DROP TABLE public."User";
       public         heap    postgres    false            �            1259    16636    User_id_seq    SEQUENCE     �   ALTER TABLE public."User" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."User_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215                      0    16652    Activity 
   TABLE DATA           U   COPY public."Activity" (id, nama_kegiatan, tanggal_kegiatan, keterangan) FROM stdin;
    public          postgres    false    222   ~/                 0    16669    HistorySchedule 
   TABLE DATA           d   COPY public."HistorySchedule" (id, id_schedule, nama, no_whatsapp, status, "timestamp") FROM stdin;
    public          postgres    false    227   �/                 0    16638 	   Recipient 
   TABLE DATA           <   COPY public."Recipient" (id, nama, no_whatsapp) FROM stdin;
    public          postgres    false    218   �/                 0    16665    RecipientList 
   TABLE DATA           D   COPY public."RecipientList" (id_schedule, id_recipient) FROM stdin;
    public          postgres    false    225   30                 0    16660    Schedule 
   TABLE DATA           ~   COPY public."Schedule" (id, id_message, jenis_message, id_activity, jenis_schedule, tanggal_mulai, tanggal_akhir) FROM stdin;
    public          postgres    false    224   P0                 0    16644    TemplateMessage 
   TABLE DATA           H   COPY public."TemplateMessage" (id, jenis_template, message) FROM stdin;
    public          postgres    false    220   �0                 0    16631    User 
   TABLE DATA           8   COPY public."User" (id, username, password) FROM stdin;
    public          postgres    false    215   21                   0    0    Activity_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Activity_id_seq"', 1, true);
          public          postgres    false    221            !           0    0    HistoryMessage_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."HistoryMessage_id_seq"', 1, false);
          public          postgres    false    226            "           0    0    Recipien_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Recipien_id_seq"', 2, true);
          public          postgres    false    217            #           0    0    Schedule_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Schedule_id_seq"', 2, true);
          public          postgres    false    223            $           0    0    TemplateMessage_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."TemplateMessage_id_seq"', 2, true);
          public          postgres    false    219            %           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 2, true);
          public          postgres    false    216            t           2606    16658    Activity Activity_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Activity" DROP CONSTRAINT "Activity_pkey";
       public            postgres    false    222            x           2606    16673 #   HistorySchedule HistoryMessage_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public."HistorySchedule"
    ADD CONSTRAINT "HistoryMessage_pkey" PRIMARY KEY (id_schedule);
 Q   ALTER TABLE ONLY public."HistorySchedule" DROP CONSTRAINT "HistoryMessage_pkey";
       public            postgres    false    227            p           2606    16642    Recipient Recipien_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public."Recipient"
    ADD CONSTRAINT "Recipien_pkey" PRIMARY KEY (id);
 E   ALTER TABLE ONLY public."Recipient" DROP CONSTRAINT "Recipien_pkey";
       public            postgres    false    218            v           2606    16685    Schedule Schedule_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Schedule" DROP CONSTRAINT "Schedule_pkey";
       public            postgres    false    224            r           2606    16650 $   TemplateMessage TemplateMessage_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."TemplateMessage"
    ADD CONSTRAINT "TemplateMessage_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."TemplateMessage" DROP CONSTRAINT "TemplateMessage_pkey";
       public            postgres    false    220            n           2606    16635    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    215            y           2606    16679    Schedule fk_id_activity    FK CONSTRAINT     �   ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT fk_id_activity FOREIGN KEY (id_activity) REFERENCES public."Activity"(id);
 C   ALTER TABLE ONLY public."Schedule" DROP CONSTRAINT fk_id_activity;
       public          postgres    false    222    4724    224            z           2606    16674    Schedule fk_id_message    FK CONSTRAINT     �   ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT fk_id_message FOREIGN KEY (id_message) REFERENCES public."TemplateMessage"(id);
 B   ALTER TABLE ONLY public."Schedule" DROP CONSTRAINT fk_id_message;
       public          postgres    false    220    4722    224            {           2606    16701    RecipientList fk_id_recipient    FK CONSTRAINT     �   ALTER TABLE ONLY public."RecipientList"
    ADD CONSTRAINT fk_id_recipient FOREIGN KEY (id_recipient) REFERENCES public."Recipient"(id);
 I   ALTER TABLE ONLY public."RecipientList" DROP CONSTRAINT fk_id_recipient;
       public          postgres    false    218    225    4720            }           2606    16686    HistorySchedule fk_id_schedule    FK CONSTRAINT     �   ALTER TABLE ONLY public."HistorySchedule"
    ADD CONSTRAINT fk_id_schedule FOREIGN KEY (id_schedule) REFERENCES public."Schedule"(id);
 J   ALTER TABLE ONLY public."HistorySchedule" DROP CONSTRAINT fk_id_schedule;
       public          postgres    false    227    224    4726            |           2606    16696    RecipientList fk_id_schedule    FK CONSTRAINT     �   ALTER TABLE ONLY public."RecipientList"
    ADD CONSTRAINT fk_id_schedule FOREIGN KEY (id_schedule) REFERENCES public."Schedule"(id);
 H   ALTER TABLE ONLY public."RecipientList" DROP CONSTRAINT fk_id_schedule;
       public          postgres    false    225    224    4726               A   x�3�N�K��4202�54�50�t�N�SH�LLI1�A�
��@1��Ĝ�L����D�=... Ak            x������ � �         7   x�3�t�M��L��63�0645�45�40�2�I,��Z���Y�Zp��qqq 0�
�            x������ � �         J   x�3�4�LO�K-J�����H,�L��4202�54�50F0M��8�8�K2�2K*��r3���K��62�b���� yy         x   x�m��
�@Dϛ����XOd���()��vi��mf�̬�����0��8:��5{���Å���R�u�)ʫ���j?)D�Y�����
k,f�ҝ�t�:�����rGDb?         X   x�3�LL����T1JR14P��/��HINH2
/��*(�,���N�JKK�33���J��϶/�*�r���u��2�bD�)1z\\\ ��-:     