/************************* MKB_CLASSES **************************/
create table MKB_CLASSES(
       ID NUMBER NOT NULL,
       CLASS VARCHAR2(10) NOT NULL,
       DESCRIPTION VARCHAR2(200) NOT NULL,
       CODE_FROM VARCHAR2(5),
       CODE_TO VARCHAR2(5)
);

alter table MKB_CLASSES add constraint CLASSES_PK_ID primary key (ID) enable;

/************************* MKB10 **************************/
create table MKB10 (
       ID NUMBER NOT NULL,
       CLASS_ID NUMBER NOT NULL,
       MKB_CODE VARCHAR2(10),
       MKB_NAME VARCHAR2(500)
);

alter table MKB10 add constraint MKB_PK_ID primary key (ID) enable;
alter table MKB10 add constraint MKB_FK_CLASS_ID foreign key (CLASS_ID) references MKB_CLASSES (ID) enable;

/************************* DISEASECASEvs **************************/
create table DISEASECASE (
       ID NUMBER NOT NULL,
       MKB_ID NUMBER NOT NULL,
       MKB VARCHAR2(500) NOT NULL,
       OPENDATE DATE NOT NULL,
       CLOSEDATE DATE,
       SEX NUMBER(1),
       AGE NUMBER(3)
);

alter table DISEASECASE add constraint DC_PK_ID primary key (ID) enable;
alter table DISEASECASE add constraint DC_FK_MKB_ID foreign key (MKB_ID) references MKB10 (ID) enable;