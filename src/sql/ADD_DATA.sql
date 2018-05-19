drop sequence GEN_ID;
create sequence GEN_ID start with 1 increment by 1;

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'I', 'Некоторые инфекционные и паразитарные заболевания', 'A00', 'B99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'II', 'Новообразования', 'C00', 'D48');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'III', 'Болезни крови, кроветворных органов и отдельные нарушения, вовлекающие иммунальный механизм', 'D50', 'D89');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'IV', 'Болезни эндокринной системы, расстройства питания и нарушения обмена веществ', 'E00', 'E90');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'V', 'Психические расстройства и расстройства поведения', 'F00', 'F99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'VI', 'Болезни нервной системы', 'G00', 'G99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'VII', 'Болезни глаза и его придаточного аппарата', 'H00', 'H59');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'VIII', 'Болезни уха и сосцевидного отростка', 'H60', 'H95');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'IX', 'Болезни системы кровообращения', 'I00', 'I99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'X', 'Болезни органов дыхания', 'J00', 'J99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XI', 'Болезни системы пищеварения', 'K00', 'K93');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XII', 'Болезни кожи и подкожной клетчатки', 'L00', 'L99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XIII', 'Болезни костно-мышечной системы и соединительной ткани', 'M00', 'M99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XIV', 'Болезни мочеполовой системы', 'N00', 'N99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XV', 'Беременность, роды и послеродовой период', 'O00', 'O99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XVI', 'Отдельные состояния, возникающие в перинатальном периоде', 'P00', 'P96');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XVII', 'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения', 'Q00', 'Q99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XVIII', 'Симптомы, признаки и отклонения от нормы, выявленные при клинических и лабораторных исследованиях, не классифицированные в других рубриках', 'R00', 'R99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XIX', 'Травмы, отравления и некоторые другие последствия воздействия внешних причин', 'S00', 'T98');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XX', 'Внешние причиные заболеваемости и смертности', 'V01', 'Y98');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XXI', 'Факторые, влияющие на состояние здоровья населения и обращения в учреждения здравоохранения', 'Z00', 'Z99');

insert into MKB_CLASSES (ID, CLASS, DESCRIPTION, CODE_FROM, CODE_TO)
values (GEN_ID.NEXTVAL, 'XXII', 'Коды для особых целей', 'U00', 'U85');















