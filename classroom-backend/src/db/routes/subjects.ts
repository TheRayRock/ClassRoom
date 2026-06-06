import express from "express";
import { departments, subjects } from "../Schema/app.js";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { db } from "../index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 20 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;
    const filterConditions = [];
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentsId, departments.id))
      .where(whereClause);

    const totolCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(departments),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentsId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      Pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totolCount,
        totalPages: Math.ceil(totolCount / limitPerPage),
      },
    });
  } catch (e) {
    console.error(`get /subject errror: ${e}`);
    res.status(200).json({ error: "Failed to get subject" });
  }
});

export default router;
